# figma2css.py

figmaのカラーバリアブルをCSSに変換

## command
inputpath指定
```bash
python scripts/figma2css.py --input-path
python scripts/figma2css.py C:\Users\deded\Downloads\figma\Connecto\Light.tokens.json
```

## input

```json
{
  "ref": {
    "Primary 100": {
      "$type": "color",
      "$value": {
        "colorSpace": "srgb",
        "components": [
          1,
          1,
          1
        ],
        "alpha": 1,
        "hex": "#FFFFFF"
      },
      "$extensions": {
        "com.figma.variableId": "VariableID:2655:66907",
        "com.figma.hiddenFromPublishing": true,
        "com.figma.scopes": [
          "ALL_SCOPES"
        ]
      }
    },
    ...
  }
}
```

# output
scripts/res.css

```css
@import "tailwindcss";
:root {
  --Primary-100: #FFFFFF;
  --Primary-99: #FFFBFF;
}

@theme inline {
  --color-Primary-100: var(--Primary-100);
  --color-Primary-99: var(--Primary-99);
}
```
