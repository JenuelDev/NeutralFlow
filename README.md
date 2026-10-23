<p align="center">
  <h2 align="center">NeutralFlow</h2>
  <p align="center">
    A clean, calm dark theme with neutral tones designed for focused and comfortable coding.
  </p>
  <p align="center">
    Available for <b>Visual Studio Code</b> and <b>Zed</b>.
  </p>
</p>

<p align="center">
  <img src="assets/main.png" width="600" >
</p>

<br>

<p align="center">
  <img src="assets/screenshot.png">
</p>

## Supported Editors

| Editor | How to install |
|--------|----------------|
| **Visual Studio Code** | Install [NeutralFlow from the Marketplace](https://marketplace.visualstudio.com/items?itemName=JenuelDevOfficial.neutralflow) |
| **Zed** | Install as a dev extension from this repository (see [Using NeutralFlow in Zed](#using-neutralflow-in-zed)) |

## Available Themes

NeutralFlow comes with **7 beautiful color variations**, available in both VS Code and Zed. Each has a unique accent palette while maintaining the same calm, neutral base:

| Theme | Accent Color | Description |
|-------|--------------|-------------|
| **NeutralFlow** | Purple (#957FB8) | Original theme with purple accents - balanced and professional |
| **NeutralFlow Emerald** | Green (#4A7C59) | Nature-inspired green tones - fresh and calming |
| **NeutralFlow Sapphire** | Blue (#5B7C99) | Ocean-inspired blue tones - cool and focused |
| **NeutralFlow Amber** | Orange (#D48C3E) | Warm sunset amber tones - energetic and warm |
| **NeutralFlow Rose** | Pink (#C85A6C) | Soft rose pink tones - gentle and creative |
| **NeutralFlow Violet** | Violet (#8B6FA3) | Deep violet purple tones - creative and sophisticated |
| **NeutralFlow One Dark Pro** | Multi-color | Inspired by One Dark Pro - vibrant and popular |

### How to Switch Themes

The shortcut is the same in VS Code and Zed:

1. Press `Ctrl+K Ctrl+T` (or `Cmd+K Cmd+T` on macOS)
2. Select your preferred NeutralFlow variant from the theme picker
3. Enjoy your new color scheme!

## Using NeutralFlow in Zed

All 7 variants are also available for [Zed](https://zed.dev). To install them from this repository:

1. Clone the repository.
2. In Zed, open the command palette, run `zed: install dev extension`, and select the `zed/` folder.
3. Press `Ctrl+K Ctrl+T` (or `Cmd+K Cmd+T` on macOS) and pick a NeutralFlow variant.

The Zed themes are generated from the VS Code themes in `themes/`. After changing a VS Code theme, regenerate them with:

```sh
npm run build:zed
```

## Semantic tokens (VS Code)

Theme supports and recommends enabling semantic tokens.

### TypeScript

Enabled by default.

### Go

```json
{
  "gopls.ui.semanticTokens": true
}
```

#### rust-analyzer

```json
{
  "rust-analyzer.highlighting.strings": true
}
```

#### `C#`

```json
{
  "csharp.semanticHighlighting.enabled": true
}
```

## Customization (VS Code)

### Comments

If you prefer comments to stand out in your code - this looks nice:

```json
{
  "editor.tokenColorCustomizations": {
    "[NeutralFlow]": {
      "comments": {
        "foreground": "#FF9E3B"
      }
    }
  }
}
```

Paste it in your `settings.json`.
