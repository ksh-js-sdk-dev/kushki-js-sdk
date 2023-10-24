echo '** CREATE DOCS JSON TO PUBLIC MODULES **'

npx typedoc --options ./config/docs/typedoc-build.json --json ./docs-json/Kushki.json --name Kushki --entryPoints src/module/Kushki.ts
npx typedoc --options ./config/docs/typedoc-build.json --json ./docs-json/Card.json --name Card --entryPoints src/module/Card.ts

echo '** CREATE HTML DOCS **'

npx typedoc --options ./config/docs/typedoc-html.json
