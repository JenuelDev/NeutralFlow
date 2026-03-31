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

# 4. Check critical color pairs
$bgColor = $theme.colors.'editor.background'
$fgColor = $theme.colors.'editor.foreground'

if ($bgColor -and $fgColor) {
    Write-Host "[Theme Hook] ℹ Editor: $fgColor on $bgColor" -ForegroundColor Cyan
}

# 5. Check for common issues
$warnings = @()

# Check for JSONC comments (not allowed in theme files)
$content = Get-Content $ThemeFile -Raw
if ($content -match '//|/\*') {
    $warnings += "File contains comments (JSONC) - remove before publishing"
}

# Check for undefined color references
$colorDefs = $theme.colors.PSObject.Properties.Name
$colorRefs = [regex]::Matches($content, '#[A-Fa-f0-9]{6}').Value | Select-Object -Unique

Write-Host "[Theme Hook] ℹ Found $($colorRefs.Count) unique color hex codes" -ForegroundColor Cyan

if ($warnings.Count -gt 0) {
    Write-Host "`n[Theme Hook] ⚠ Warnings:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "  - $warning" -ForegroundColor Yellow
    }
}

Write-Host "`n[Theme Hook] ✓ Validation complete" -ForegroundColor Green
Write-Host "[Theme Hook] Press F5 to test in Extension Development Host" -ForegroundColor Cyan
