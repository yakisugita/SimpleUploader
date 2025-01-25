import { Hono } from "hono"
import type { FC } from "hono/jsx"
import { basicAuth } from 'hono/basic-auth'

type Env =  {
    R2_BUCKET: R2Bucket
    USER: string
    PASSWORD: string
}

const app = new Hono()

// ユーザー名,パスワードが設定されていればBasic認証を設定
app.use("*", async (c:any, next) => {
  const user = c.env.USER
  const pass = c.env.PASSWORD
  if (user !== null || user != "" || pass !== null || pass != "") {} else {
    basicAuth({
        username: user,
        password: pass,
      })
  }

  await next
()
})

const Layout: FC = (props) => {
    return (
        <html>
            <body>{props.children}</body>
        </html>
    )
}


const Form: FC = (props) => {
    return(
        <form enctype="multipart/form-data" method="post">
        <input name="file" type="file" />
        <input type="submit" value="Upload" />
        </form>
    )
}


const Top: FC<{ files: any[] }> = (props: {
    files: any[]
  }) => {
    return (
      <Layout>
        <h1>Simple Uploader</h1>
        <Form></Form>
        <ul>
          {props.files.map((file) => {
            return <li><a href={"/"+file.key}>{file.key}</a></li>
          })}
        </ul>
      </Layout>
    )
  }

const Result: FC<{ message: string} > = (props: { message: string}) => {
    return (
        <Layout>
            <h1>{props.message}</h1>
            <a href="/">Return To TOP</a>
        </Layout>
    )
}

// TOP ファイル一覧表示
app.get("/", async (c:any) => {
    const r2List = await c.env.R2_BUCKET.list()
    console.log(r2List.objects)

    return c.html(<Top files={r2List.objects} />)
})

// アップロード
app.post("/", async (c:any) => {
    const body = await c.req.parseBody()
    const file = body['file'] // File | string
    console.log(typeof(file))
    if (typeof(file) == "object") {
        // 同名のファイルがないかチェック
        const object = await c.env.R2_BUCKET.get(file.name)
        if (object === null) {
            const blob = new Blob([file], { type: file.type })
        
            await c.env.R2_BUCKET.put(file.name, blob)

            return c.html(<Result message="Success" />, 200)
        } else {
            return c.html(<Result message="Conflict" />, 409)
        }
    } else {
        return c.html(<Result message="Bad Request" />, 400)
    }
})

// 削除

// ダウンロード
app.get("/:filename", async (c:any) => {
    const fileName:string = c.req.param("filename")

    const object = await c.env.R2_BUCKET.get(fileName)
    if (object !== null) {
        return c.body(object.body)
    } else {
        return c.notFound()
    }
})

export default app