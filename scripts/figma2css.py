import json
import sys
from pathlib import Path


def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("python generate_css.py tokens.json")
        return

    json_path = Path(sys.argv[1])

    if not json_path.exists():
        print(f"File not found: {json_path}")
        return

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    colors = data.get("ref", {})

    css_vars = []
    css_aliases = []

    for name, value in colors.items():
        if value.get("$type") != "color":
            continue

        hex_value = value.get("$value", {}).get("hex")
        if not hex_value:
            continue

        css_name = name.replace(" ", "-")

        css_vars.append(f"  --{css_name}: {hex_value};")
        css_aliases.append(
            f"  --color-{css_name}: var(--{css_name});"
        )

    css = (
        "@import \"tailwindcss\";\n"
        + ":root {\n"
        + "\n".join(css_vars)
        + "\n}\n\n"
        + "@theme inline {\n"
        + "\n".join(css_aliases)
        + "\n}\n"
    )

    output_path = Path(__file__).parent / "res.css" 
    # output_path = json_path.parent / "res.css"

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(css)

    print(f"Generated: {output_path}")


if __name__ == "__main__":
    main()