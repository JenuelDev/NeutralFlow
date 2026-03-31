# Accessibility Checker Skill

## Purpose

Automatically validate color contrast ratios in VS Code theme files against WCAG AA accessibility standards.

## Capabilities

- Calculate contrast ratios between foreground/background color pairs
- Check WCAG AA compliance (4.5:1 for normal text, 3:1 for large text)
- Identify problematic color combinations in theme JSON
- Suggest alternative colors that meet accessibility standards
- Generate accessibility report for theme files

## Usage

### Basic Check

```
Check the NeutralFlow theme for WCAG AA accessibility compliance
```

### Specific Color Check

```
Verify contrast ratio between #DCD7BA and #1F1F28 meets WCAG standards
```

### Full Report

```
Generate an accessibility report for themes/neutralflow-color-theme.json
```

## Implementation

This skill uses the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards:

- **Normal text**: Minimum 4.5:1 contrast ratio
- **Large text** (18pt+ or 14pt+ bold): Minimum 3:1 contrast ratio
- **UI components**: Minimum 3:1 contrast ratio

### Contrast Ratio Formula

The contrast ratio is calculated using the relative luminance of two colors:

```
L = 0.2126 * R + 0.7152 * G + 0.0722 * B

Contrast Ratio = (L1 + 0.05) / (L2 + 0.05)
```

Where L1 is the lighter color and L2 is the darker color.

## Key Color Pairs to Check

In the NeutralFlow theme, verify these critical pairs:

1. **Editor**: `editor.foreground` (#DCD7BA) on `editor.background` (#1F1F28)
2. **Terminal**: `terminal.foreground` on `terminal.background`
3. **Status Bar**: `statusBar.foreground` on `statusBar.background`
4. **Activity Bar**: `activityBar.foreground` on `activityBar.background`
5. **Git Decorations**: 
   - `gitDecoration.addedResourceForeground` (#76946A)
   - `gitDecoration.modifiedResourceForeground` (#658594)
   - `gitDecoration.deletedResourceForeground` (#E82424)

## Example Output

```markdown
## Accessibility Report - NeutralFlow Theme

### ✅ Pass
- Editor text: 12.3:1 (Required: 4.5:1)
- Status bar: 8.7:1 (Required: 4.5:1)

### ⚠️ Warnings
- Git deleted resource: 4.2:1 on background (Required: 4.5:1)
  Suggestion: Darken to #D42020 for 4.6:1 ratio

### Summary
- Total checks: 24
- Passed: 23
- Failed: 1
- Compliance: WCAG AA (96%)
```

## Related Commands

- `/check-contrast <color1> <color2>` - Check specific color pair
- `/accessibility-report` - Generate full theme report
- `/suggest-alternative <color>` - Get accessible color alternatives

## References

- [WCAG 2.1 Level AA](https://www.w3.org/WAI/WCAG21/quickref/?versions=2.1&showtechniques=143#contrast-minimum)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [VS Code Theme Accessibility](https://code.visualstudio.com/api/extension-guides/color-theme#theme-color-reference)
