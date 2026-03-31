# Theme Preview Hook

## Purpose

Automatically validate and preview theme changes whenever `neutralflow-color-theme.json` is modified.

## Triggers

- File save: `themes/neutralflow-color-theme.json`
- Before commit: Check theme file changes
- On request: Manual preview generation

## Actions

### 1. Validate JSON Syntax

Ensure the theme file is valid JSON (not JSONC - no comments allowed).

```powershell
# Validate JSON
Get-Content themes/neutralflow-color-theme.json | ConvertFrom-Json
```

### 2. Run Accessibility Check

Execute the accessibility-checker skill to verify WCAG AA compliance.

### 3. Generate Preview

Launch Extension Development Host (F5) to preview changes.

### 4. Update Screenshot (Optional)

If UI changes are significant, prompt to update `assets/screenshot.png`.

## Usage

### Automatic (On Save)

When you save `themes/neutralflow-color-theme.json`:

```
[Hook] Validating theme...
[Hook] ✓ JSON syntax valid
[Hook] ✓ Accessibility check passed (24/24 checks)
[Hook] Ready for testing in Extension Development Host
```

### Manual Trigger

```
Run the theme preview hook
```

### Before Commit

```
Check if theme changes are ready to commit
```

## Implementation Script

```powershell
# File: .github/hooks/validate-theme.ps1

param(
    [string]$ThemeFile = "themes/neutralflow-color-theme.json"
)

Write-Host "[Theme Hook] Validating $ThemeFile..." -ForegroundColor Cyan

# 1. Validate JSON
try {
    $theme = Get-Content $ThemeFile | ConvertFrom-Json -ErrorAction Stop
    Write-Host "[Theme Hook] ✓ JSON syntax valid" -ForegroundColor Green
} catch {
    Write-Host "[Theme Hook] ✗ JSON validation failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 2. Check required fields
$requiredFields = @('name', 'colors', 'tokenColors')
$missingFields = $requiredFields | Where-Object { -not $theme.$_ }

if ($missingFields) {
    Write-Host "[Theme Hook] ✗ Missing required fields: $($missingFields -join ', ')" -ForegroundColor Red
    exit 1
}

Write-Host "[Theme Hook] ✓ Required fields present" -ForegroundColor Green

# 3. Count color definitions
$colorCount = ($theme.colors.PSObject.Properties | Measure-Object).Count
$tokenCount = ($theme.tokenColors | Measure-Object).Count

Write-Host "[Theme Hook] ℹ Theme contains $colorCount colors and $tokenCount token rules" -ForegroundColor Yellow

# 4. Accessibility check (basic)
$bgColor = $theme.colors.'editor.background'
$fgColor = $theme.colors.'editor.foreground'

if ($bgColor -and $fgColor) {
    Write-Host "[Theme Hook] ℹ Editor: $fgColor on $bgColor" -ForegroundColor Cyan
    # TODO: Integrate with accessibility-checker skill
}

Write-Host "[Theme Hook] ✓ Validation complete" -ForegroundColor Green
Write-Host "[Theme Hook] Press F5 to test in Extension Development Host" -ForegroundColor Cyan
```

## Integration

### VS Code Tasks

Add to `.vscode/tasks.json`:

```json
{
  "label": "Validate Theme",
  "type": "shell",
  "command": "pwsh -File ${workspaceFolder}/.github/hooks/validate-theme.ps1",
  "group": "build",
  "problemMatcher": []
}
```

### Git Hook (Pre-commit)

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
pwsh -File .github/hooks/validate-theme.ps1
if [ $? -ne 0 ]; then
    echo "Theme validation failed. Commit aborted."
    exit 1
fi
```

## Example Output

```
[Theme Hook] Validating themes/neutralflow-color-theme.json...
[Theme Hook] ✓ JSON syntax valid
[Theme Hook] ✓ Required fields present
[Theme Hook] ℹ Theme contains 87 colors and 42 token rules
[Theme Hook] ℹ Editor: #DCD7BA on #1F1F28
[Theme Hook] ✓ Validation complete
[Theme Hook] Press F5 to test in Extension Development Host
```

## Related Files

- `.github/skills/accessibility-checker.md` - Accessibility validation
- `themes/neutralflow-color-theme.json` - Theme file
- `.vscode/tasks.json` - Task configuration
- `AGENTS.md` - Agent instructions

## Next Steps

After validation:
1. Press `F5` to launch Extension Development Host
2. Test with `Ctrl+K Ctrl+T` (Select Color Theme)
3. Choose "NeutralFlow"
4. Verify colors in different views (editor, sidebar, terminal)
