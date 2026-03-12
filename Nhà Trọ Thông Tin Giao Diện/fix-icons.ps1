# Fix corrupted patterns from TypeScript conversion

Write-Host "Fixing corrupted patterns..."

Get-ChildItem -Path src -Recurse -Include *.jsx,*.js | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw -Encoding UTF8
    $changed = $false
    
    # Fix corrupted Record types: "const x, { props }> ="  -> "const x ="
    if ($content -match ', \{ icon: typeof') {
        $content = $content -replace 'const (\w+), \{ icon: typeof [^;]+; label: string[^>]*\}> =', 'const $1 ='
        $changed = $true
    }
    
    # Fix corrupted Record types with 3 properties
    if ($content -match ', \{ icon: typeof [^;]+; label: string; color: string[^>]*\}> =') {
        $content = $content -replace 'const (\w+), \{ icon: typeof [^;]+; label: string; color: string[^>]*\}> =', 'const $1 ='
        $changed = $true
    }
    
    # Save if changed
    if ($changed) {
        Set-Content $file -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Fixed: $($_.Name)"
    }
}

Write-Host "Pattern fixes completed!"
Write-Host "`nNow you need to manually restore icon names in amenityConfig objects."
Write-Host "Check these files:"
Write-Host " - src/app/components/PropertyCard.jsx"
Write-Host " - src/app/pages/RoomDetailPage.jsx"
