import { Hono } from "hono"
import type { FC } from "hono/jsx"

type Env =  {
    R2_BUCKET: R2Bucket
}

const app = new Hono()

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
        <h1>Hello Hono!</h1>
        <Form></Form>
        <ul>
          {props.files.map((file) => {
            return <li>{file.key}</li>
          })}
        </ul>
      </Layout>
    )
  }


app.get("/", async (c) => {
    const r2List = await c.env.R2_BUCKET.list()
    console.log(r2List.objects)
    return c.html(<Top files={r2List.objects} />)
})

app.post("/", async (c) => {
    const body = await c.req.parseBody()
    const file = body['file']
    console.log(typeof(file))
    // if (typeof(file) == "ob")
    const blob = new Blob([body['file']], { type: body['file'].type })
    console.log(file.type)
    console.log(body)
    console.log(body['file']) // File | string
    return c.text("POST /")
})

export default app