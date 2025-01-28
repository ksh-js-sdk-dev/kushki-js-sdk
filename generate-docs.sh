echo '** CREATE DOCS JSON TO PUBLIC MODULES **'

npx typedoc --options ./config/docs/typedoc-build.json --json ./docs-json/Kushki.json --name Kushki --entryPoints src/module/Kushki.ts
npx typedoc --options ./config/docs/typedoc-build.json --json ./docs-json/Card.json --name Card --entryPoints src/module/Card.ts
npx typedoc --options ./config/docs/typedoc-build.json --json ./docs-json/CardPayouts.json --name CardPayouts --entryPoints src/module/CardPayouts.ts
npx typedoc --options ./config/docs/typedoc-build.json --json ./docs-json/Transfer.json --name Transfer --entryPoints src/module/Transfer.ts
npx typedoc --options ./config/docs/typedoc-build.json --json ./docs-json/Merchant.json --name Merchant --entryPoints src/module/Merchant.ts
npx typedoc --options ./config/docs/typedoc-build.json --json ./docs-json/AntiFraud.json --name Antifraud --entryPoints src/module/AntiFraud.ts
npx typedoc --options ./config/docs/typedoc-build.json --json ./docs-json/CardAnimation.json --name CardAnimation --entryPoints src/module/CardAnimation.ts

echo '** CREATE HTML DOCS **'

npx typedoc --options ./config/docs/typedoc-html.json
