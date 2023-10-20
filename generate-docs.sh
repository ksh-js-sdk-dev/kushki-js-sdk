echo '** CREATE DOCS JSON TO PUBLIC MODULES **'

npx typedoc --options ./config/docs/typedoc-build.json --json ./docs-json/Kushki.json --name Kushki --entryPoints src/module/Kushki.ts
npx typedoc --options ./config/docs/typedoc-build.json --json ./docs-json/Payment.json --name Payment --entryPoints src/module/Payment.ts

echo '** CREATE HTML DOCS **'

npx typedoc --options ./config/docs/typedoc-html.json

echo '** CREATE MARKDOWN DOCS **'

npx typedoc --options ./config/docs/typedoc-html.json --out wiki --plugin typedoc-plugin-markdown