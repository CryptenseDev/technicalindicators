#!/usr/bin/env bash
./node_modules/.bin/dts-bundle --name indicators --main declarations/index.d.ts --out generated.d.ts --baseDir declarations --outputAsModuleFolder
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' 's/default class/class/g' ./declarations/generated.d.ts
    sed -i '' 's/export { .* };//g' ./declarations/generated.d.ts
else
    sed -i 's/default class/class/g' ./declarations/generated.d.ts
    sed -i 's/export { .* };//g' ./declarations/generated.d.ts
fi

