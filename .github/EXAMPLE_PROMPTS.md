# NeutralFlow Theme - Example Agent Prompts

## Quick Start

After setting up the workspace, try these prompts to see the agents in action:

### Theme Development

1. **Add a new color**
   ```
   Add a new color for breadcrumb navigation to the NeutralFlow theme
   ```

2. **Review accessibility**
   ```
   Check the NeutralFlow theme for WCAG AA accessibility compliance
   ```

3. **Generate accessibility report**
   ```
   Generate an accessibility report for themes/neutralflow-color-theme.json
   ```

4. **Verify specific colors**
   ```
   Verify contrast ratio between #DCD7BA and #1F1F28 meets WCAG standards
   ```

5. **Suggest improvements**
   ```
   Suggest improvements to the current color palette for better readability
   ```

### Packaging & Publishing

6. **Package for testing**
   ```
   Package the extension for local testing
   ```

7. **Prepare for Marketplace**
   ```
   Package the extension and prepare it for Marketplace publish
   ```

8. **Version bump**
   ```
   Update the version in package.json and prepare for release
   ```

### Theme Variations

9. **Create light variant**
   ```
   Help me create a light theme variant of NeutralFlow
   ```

10. **Create high contrast variant**
    ```
    Create a high contrast version of NeutralFlow for accessibility
    ```

11. **Adjust accent colors**
    ```
    Suggest a more vibrant accent color palette while keeping the neutral base
    ```

### Validation & Testing

12. **Run validation hook**
    ```
    Run the theme preview hook to validate recent changes
    ```

13. **Check for common issues**
    ```
    Check if the theme file has any JSON syntax issues or missing colors
    ```

14. **Pre-commit validation**
    ```
    Check if theme changes are ready to commit
    ```

## Advanced Workflows

### Complete Theme Review

```
Perform a comprehensive review of the NeutralFlow theme:
1. Check all color contrast ratios for WCAG AA compliance
2. Identify any missing color definitions
3. Suggest improvements to the syntax highlighting
4. Verify all required VS Code theme properties are present
```

### Create New Feature

```
I want to add support for the new VS Code notebook interface.
Add the necessary color tokens for:
- Notebook cell backgrounds
- Notebook cell borders
- Notebook status bar
Ensure all new colors meet accessibility standards.
```

### Debug Color Issues

```
Users report that the terminal colors are hard to read.
Analyze the terminal color configuration and suggest improvements
that maintain the neutral aesthetic while improving readability.
```

## Using the Hooks

### Manual Validation

```bash
pwsh -File .github/hooks/validate-theme.ps1
```

### VS Code Task

Press `Ctrl+Shift+P` → "Tasks: Run Task" → "Validate Theme"

### Keyboard Shortcut (Optional)

Add to `.vscode/keybindings.json`:

```json
{
  "key": "ctrl+shift+v",
  "command": "workbench.action.tasks.runTask",
  "args": "Validate Theme"
}
```

## Custom Agent Capabilities

This workspace includes the **VS Code Theme Creator** agent with specialized knowledge for:

- ✅ Color theory and palette design
- ✅ WCAG accessibility standards
- ✅ VS Code theme API and contribution points
- ✅ Extension packaging and publishing
- ✅ Theme testing best practices

## Next Steps

After using these prompts, consider:

1. Creating additional skills for specific languages
2. Setting up automated screenshot generation
3. Building a color token documentation generator
4. Creating a theme comparison tool

---

**Tip**: Always test theme changes in the Extension Development Host (F5) before publishing.
