# slidev-slides

[slidev](https://ja.sli.dev/) を用いたスライドをモノレポで管理するリポジトリ。

## ディレクトリ構成

bunのworkspaceを用いている。ルートには各種依存とビルドスクリプト、ビルドコマンドなど。slides以下には各スライドが入っている。

## 補足事項

- `docs/slidev-llms-full.txt` は[llmstxt.new](https://www.llmstxt.new/)を用いてslidevのドキュメントをLLM
  readableにしたものが入っている。
-

## for LLMs

- `docs/slidev-llms-full.txt` はslidevのドキュメントである。必ず参照してslidevにおける正しい記述をせよ。
- スライドは文字だけでなく図表を積極的に用いよ。
- 図を書く場合はmermaidを用いよ。
- PDFで資料配布されることを想定しアニメーションは明確に指示され無い限り使用してはならない。
- `.cursor/rules/use-bun-instead-of-node-vite-npm-pnpm.mdc` を読み込みbunを必ず用いよ。
