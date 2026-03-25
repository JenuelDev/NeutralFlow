<p align="center">
  <h2 align="center">NeutralFlow</h2>
  <p align="center">
    A clean, calm dark theme with neutral tones designed for focused and comfortable coding.
  </p>
</p>

<p align="center">
  <img src="assets/main.png" width="600" >
</p>

<br>

<p align="center">
  <img src="assets/screenshot.png">
</p>

## Semantic tokens

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

## Customization

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
