## Basic認証機能
ユーザー名,パスワードを設定するとBasic認証がかかります。

`.dev.vars`ファイルに記述するか、`wrangler secret put <key>`コマンドで設定できます。

## `deploy.yml`を利用する場合の注意点
Basic認証を使用しない場合は、`deploy.yml`の`secrets: |`以降の行を削除またはコメントアウトしてください。