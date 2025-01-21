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


app.get("/", async (c) => {
    const list = await c.env.R2_BUCKET.list()
    return c.text("TOP PAGE" + list.length)
})

export default app