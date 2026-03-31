# Customizations Created for NeutralFlow

## Overview

This document summarizes the custom agent capabilities created for the NeutralFlow VS Code theme extension workspace.

## Files Created

### 1. Accessibility Checker Skill
📁 `.github/skills/accessibility-checker.md`

**Purpose**: Validate color contrast ratios against WCAG AA standards

**Features**:
- Calculate contrast ratios between color pairs
- Check WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
- Identify problematic color combinations
- Suggest alternative colors for better accessibility

**Example Usage**:
```
"Check the NeutralFlow theme for WCAG AA accessibility compliance"
```

### 2. Theme Preview Hook
📁 `.github/hooks/theme-preview.md`

**Purpose**: Automatically validate theme changes on file save

**Features**:
- JSON syntax validation
- Required field verification
- Color definition counting
- Pre-commit validation support

**Example Usage**:
```
"Run the theme preview hook"
```

### 3. Validation Script
📁 `.github/hooks/validate-theme.ps1`

**Purpose**: PowerShell script for automated theme validation

**Features**:
- JSON parsing and validation
- Required field checking
- Color count statistics
- Warning detection (JSONC comments, etc.)

**Run Manually**:
```powershell
pwsh -File .github/hooks/validate-theme.ps1
```

### 4. VS Code Configuration
📁 `.vscode/settings.json`

**Purpose**: Workspace-specific settings for optimal development experience

**Settings**:
- PowerShell terminal configuration (fixes `mgt.clearMarks` error)
- Auto-approve validation script in Copilot Chat
- Spell checker dictionary

### 5. VS Code Tasks
📁 `.vscode/tasks.json`

**Purpose**: Quick access to common development tasks

**Available Tasks**:
- **Validate Theme**: Run accessibility and syntax checks
- **Package Extension**: Create .vsix file for testing
- **Run Extension**: Launch Extension Development Host

**Access**: `Ctrl+Shift+P` → "Tasks: Run Task"

### 6. Example Prompts
📁 `.github/EXAMPLE_PROMPTS.md`

**Purpose**: Ready-to-use prompts for common theme development tasks

**Categories**:
- Theme Development (5 prompts)
- Packaging & Publishing (3 prompts)
- Theme Variations (3 prompts)
- Validation & Testing (3 prompts)
- Advanced Workflows (3 prompts)

### 7. Updated AGENTS.md
📁 `AGENTS.md`

**Purpose**: Enhanced with custom skills and hooks documentation

**New Sections**:
- Custom Skills & Hooks
- Accessibility Checker Skill details
- Theme Preview Hook details
- Integration examples

## Troubleshooting

### PowerShell Extension Terminal Error: `mgt.clearMarks is not a function`

**Issue**: Known bug in VS Code PowerShell Extension's terminal integration

**Solution**: The workspace includes `.vscode/settings.json` with these settings:
```json
{
  "powershell.cwd": null,
  "powershell.startAsLoginShell": false,
  "terminal.integrated.defaultProfile.windows": "PowerShell"
}
```

**Alternative**: Use regular PowerShell terminal instead of PowerShell Extension terminal:
```powershell
pwsh -File .github/hooks/validate-theme.ps1
```

**To Fix Permanently**:
1. Update PowerShell Extension to latest version
2. Reload VS Code window
3. Or disable PowerShell Extension's integrated console

## How to Use

### Quick Start

1. **Validate your theme**:
   ```
   Run the theme validation hook
   ```

2. **Check accessibility**:
   ```
   Check the NeutralFlow theme for WCAG AA compliance
   ```

3. **Add new colors**:
   ```
   Add a new color for breadcrumb navigation
   ```

### Workflow Integration

#### Before Testing
```
1. Make changes to themes/neutralflow-color-theme.json
2. Run: "Validate the theme changes"
3. Fix any issues reported
4. Press F5 to test in Extension Development Host
```

#### Before Publishing
```
1. Run: "Check accessibility compliance"
2. Run: "Package the extension for Marketplace publish"
3. Test the .vsix file locally
4. Publish to Marketplace
```

#### Before Committing
```
1. Run: "Check if theme changes are ready to commit"
2. Review validation output
3. Commit changes
```

## Benefits

### For Developers
- ✅ Automated accessibility checking
- ✅ Early error detection
- ✅ Consistent validation workflow
- ✅ Reduced manual testing time

### For Users
- ✅ Better accessibility compliance
- ✅ Higher quality themes
- ✅ Consistent color contrast
- ✅ WCAG AA standards adherence

## Example Output

```
[Theme Hook] Validating themes/neutralflow-color-theme.json...
[Theme Hook] ✓ JSON syntax valid
[Theme Hook] ✓ Required fields present
[Theme Hook] ℹ Theme contains 146 colors and 74 token rules
[Theme Hook] ℹ Editor: #DCD7BA on #1F1F28
[Theme Hook] ℹ Found 34 unique color hex codes
[Theme Hook] ✓ Validation complete
[Theme Hook] Press F5 to test in Extension Development Host
```

## Next Steps

Consider creating these additional customizations:

1. **Screenshot Generator** - Automated theme preview images
2. **Color Token Documentation** - Generate reference docs from theme JSON
3. **Variant Generator** - Create light/high-contrast theme variants
4. **Language-Specific Skills** - Enhanced syntax highlighting for specific languages

## Maintenance

### Updating Skills
- Edit files in `.github/skills/`
- Test with example prompts
- Update AGENTS.md if needed

### Updating Hooks
- Edit `.github/hooks/validate-theme.ps1`
- Test with manual execution
- Update `.github/hooks/theme-preview.md` documentation

### Adding Tasks
- Edit `.vscode/tasks.json`
- Follow existing task structure
- Test with "Tasks: Run Task"

## Support

For questions or issues:
- Check `AGENTS.md` for workspace overview
- Review `.github/EXAMPLE_PROMPTS.md` for usage examples
- Refer to VS Code Theme documentation: https://code.visualstudio.com/api/extension-guides/color-theme

---

**Created**: March 31, 2026  
**Version**: 1.0.0  
**Workspace**: NeutralFlow v1.5.2
