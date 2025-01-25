## Basic認証機能
ユーザー名,パスワードを設定するとBasic認証がかかります。

`.dev.vars`ファイルに記述するか、`wrangler secret put <key>`コマンドで設定できます。

参考リンク : [Cloudflare Workers の wrangler.toml に環境変数を書かないで管理する](https://zenn.dev/mr_ozin/articles/645502f4a621d6 )

## `deploy.yml`を利用する場合の注意点
Basic認証を使用しない場合は、`deploy.yml`の`secrets: |`以降の行を削除またはコメントアウトしてください。