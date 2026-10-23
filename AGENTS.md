# NeutralFlow - AI Agent Instructions

## Project Overview

**NeutralFlow** is a VS Code color theme extension (v1.5.2) providing a clean, calm dark theme with neutral tones designed for focused and comfortable coding.

- **Publisher**: JenuelDevOfficial
- **Repository**: https://github.com/JenuelDev/NeutralFlow
- **Type**: VS Code Theme Extension
- **Engine**: VS Code ^1.63.0

## Quick Start

### Build & Test Commands

```powershell
# Package the extension
vsce package

# Publish to Marketplace (requires PAT)
vsce publish

# Install extension locally for testing
code --install-extension neutralflow-1.5.2.vsix
```

### Development Workflow

1. Edit `themes/neutralflow-color-theme.json` to modify colors
2. Press `F5` in VS Code to launch Extension Development Host
3. Test theme in the new window via `Ctrl+K Ctrl+T` (Select Color Theme)
4. Run `npm run build:zed` to regenerate the Zed themes (see [Zed Port](#zed-port))

## Project Structure

```
NeutralFlow/
├── .github/
│   └── agents/
│       └── vscode-theme-creator.agent.md  # Custom agent for theme development
├── assets/
│   ├── icon.png                            # Extension icon
│   ├── main.png                            # Preview image
│   └── screenshot.png                      # Screenshot
├── scripts/
│   └── build-zed-theme.js                  # Generates zed/ from themes/
├── themes/
│   └── neutralflow-*-color-theme.json      # VS Code theme definitions (source of truth)
├── zed/                                    # Generated Zed extension - don't edit by hand
│   ├── extension.toml
│   ├── LICENSE                             # Copy of ../LICENSE (Zed requires one here)
│   └── themes/neutralflow.json             # All variants as one Zed theme family
├── AGENTS.md                               # This file
├── package.json                            # Extension manifest
└── README.md                               # User documentation
```

## Key Files

### `themes/neutralflow-color-theme.json`
The core theme file containing:
- **`colors`**: UI color tokens (editor, sidebar, status bar, etc.)
- **`tokenColors`**: Syntax highlighting rules for code
- **`semanticHighlighting`**: Enabled for better language support

### `package.json`
Extension manifest defining:
- Theme contribution point
- Metadata (name, version, publisher)
- Keywords and categories

## Theme Architecture

### Color Palette

The theme uses a neutral color palette with these key colors:

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#1F1F28` | Editor, sidebar background |
| Foreground | `#DCD7BA` | Primary text |
| Accent Purple | `#957FB8` | Keywords, control flow |
| Accent Orange | `#FF9E3B` | Warnings, search borders |
| Accent Red | `#E82424` | Errors, deletions |
| Accent Green | `#76946A` | Additions, success |
| Accent Blue | `#658594` | Activity bar badge |

### Semantic Tokens

Theme supports semantic highlighting. Recommended language-specific settings:

- **TypeScript**: Enabled by default
- **Go**: `"gopls.ui.semanticTokens": true`
- **Rust**: `"rust-analyzer.highlighting.strings": true`
- **C#**: `"csharp.semanticHighlighting.enabled": true`

See `README.md` for detailed customization examples.

## Development Guidelines

### Adding New Colors

1. Add color to `colors` object in theme JSON
2. Use consistent naming: `<component>.<property>`
3. Test in Extension Development Host
4. Update screenshot if UI changes significantly

### Modifying Syntax Highlighting

1. Add/modify `tokenColors` rules
2. Use standard TextMate scopes
3. Test with multiple languages
4. Ensure sufficient contrast (WCAG AA minimum)

### Testing Checklist

- [ ] Editor background and foreground readable
- [ ] Sidebar and panel colors distinct
- [ ] Status bar visible but not distracting
- [ ] Git decorations (added/modified/deleted) clear
- [ ] Search highlights visible
- [ ] Bracket matching works
- [ ] Terminal colors readable
- [ ] Hover widgets legible

## Zed Port

`scripts/build-zed-theme.js` converts every theme listed in `package.json` → `contributes.themes` into one Zed theme family at `zed/themes/neutralflow.json`, and writes `zed/extension.toml` (version taken from `package.json`).

- **UI colors** map VS Code keys to Zed keys in `buildStyle()`. Colors Zed needs but VS Code lacks (muted text, status backgrounds, dim terminal colors) are derived from the palette.
- **Syntax colors** come from `SYNTAX_MAP`: each Zed capture lists TextMate scope stacks that are resolved against `tokenColors` the way VS Code resolves them, optionally overridden by a `semanticTokenColors` selector.
- Zed themes can't target a single language or scope, so per-language rules (JSON key nesting levels, CSS property names) collapse to one color per capture.
- The published schema (`https://zed.dev/schema/themes/v0.2.0.json`) lags behind Zed: editors flag keys like `version_control.*`, `minimap.thumb.*` and `search.active_match_background` as unknown, but Zed reads them (see `crates/settings_content/src/theme.rs` in the Zed repo). Don't remove them.
- Test locally: in Zed run `zed: install dev extension` and select the `zed/` folder.
- Publish ([guide](https://zed.dev/docs/extensions/publishing/publishing-guide)): the registry doesn't take copied files. It pins this repo as a submodule and builds `zed/` at that commit, so commit and push first. With `ZED_EXTENSIONS_REPO_PATH` in `.env` set to a local clone of a `zed-industries/extensions` fork, `npm run build:zed` then syncs that clone:
  - It adds the `extensions/neutralflow-theme` submodule with the HTTPS URL, or moves it to the latest pushed commit.
  - It writes the entry below into `extensions.toml` and `.gitmodules` in sorted order, the same as `pnpm sort-extensions`, and stages the changes.
  - It warns if the pushed `zed/` differs from the local build.

  Then commit on a branch in the clone and open a PR that touches only this extension. The `version` comes from `package.json` and must match `zed/extension.toml` at the submodule commit.

  ```toml
  [neutralflow-theme]
  submodule = "extensions/neutralflow-theme"
  path = "zed"
  version = "1.5.5"
  ```

- Registry rules met by the generator: the ID ends in `-theme` and doesn't contain "zed" or "extension"; the extension contains only themes; an accepted license (MIT) sits inside `zed/`, because a license at the repo root doesn't count.

## Common Pitfalls

### Color Contrast
Ensure all text meets WCAG AA contrast ratio (4.5:1 for normal text). Use tools like [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/).

### JSON Syntax
Theme file must be valid JSON (not JSONC). No comments allowed in `neutralflow-color-theme.json`.

### Extension Packaging
- Ensure `assets/icon.png` exists before publishing
- Update `version` in `package.json` before each publish
- Test `.vsix` installation before Marketplace publish

### Color References
All colors referenced in `colors` object must be defined. Missing colors fall back to VS Code defaults.

## Custom Skills & Hooks

This workspace includes custom agent capabilities:

### Accessibility Checker Skill

Located: `.github/skills/accessibility-checker.md`

**Purpose**: Automatically validate color contrast ratios against WCAG AA standards.

**Usage**:
- "Check the NeutralFlow theme for WCAG AA accessibility compliance"
- "Verify contrast ratio between #DCD7BA and #1F1F28 meets WCAG standards"
- "Generate an accessibility report for themes/neutralflow-color-theme.json"

**Standards**:
- Normal text: Minimum 4.5:1 contrast ratio
- Large text (18pt+ or 14pt+ bold): Minimum 3:1 contrast ratio
- UI components: Minimum 3:1 contrast ratio

### Theme Preview Hook

Located: `.github/hooks/theme-preview.md`

**Purpose**: Automatically validate and preview theme changes on file save.

**Usage**:
- Run validation: `pwsh -File .github/hooks/validate-theme.ps1`
- Auto-validates on save of `themes/neutralflow-color-theme.json`
- Checks JSON syntax, required fields, and color definitions

**Integration**:
- Add to VS Code tasks for quick access
- Use as Git pre-commit hook
- Run manually before testing

## Existing Documentation

- **README.md**: User-facing documentation with installation and customization guide
- **vscode-theme-creator.agent.md**: Custom agent for theme development assistance

## Agent Capabilities

This workspace includes a custom agent: **VS Code Theme Creator**

Use it for:
- Creating new theme variations
- Adding/modifying color tokens
- Packaging and publishing workflows
- Accessibility reviews
- Best practices for theme design

## Example Agent Prompts

- "Add a new color for the breadcrumb navigation"
- "Review my theme for accessibility compliance"
- "Package the extension for Marketplace publish"
- "Suggest improvements to the current color palette"
- "Help me create a light theme variant"

## Next Steps

Consider creating:
1. **Theme preview workflow**: Automated screenshot generation
2. **Accessibility checker**: Validate color contrast ratios
3. **Light theme variant**: Complementary light version
4. **Color token documentation**: Generated reference guide

---

**Last Updated**: March 31, 2026  
**Version**: 1.5.2
