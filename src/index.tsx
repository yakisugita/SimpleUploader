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


const Top: FC<{ files: any[] }> = (props: {
    files: any[]
  }) => {
    return (
      <Layout>
        <h1>Hello Hono!</h1>
        <ul>
          {props.files.map((file) => {
            return <li>{file.key}!!</li>
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

export default app