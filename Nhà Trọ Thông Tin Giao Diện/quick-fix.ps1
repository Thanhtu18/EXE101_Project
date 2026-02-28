# Script to fix all corrupted JSX/JS files after conversion

Write-Host "Fixing all corrupted files..."

$fixes = @{
    # Fix import * from "react" -> import * as React from "react"
    'import \* from "react"' = 'import * as React from "react"'
    
    # Fix orphan closing parens like name); -> name: '', etc.
    "useState\(\{\s*name\);" = "useState({ name: '' });"
    "useState\(\{\s*username\);" = "useState({ username: '' });"
    
    # Fix array destructuring with type annotations
    "const userLocation, number\] = " = "const userLocation = "
    "const searchCenter, number\] = " = "const searchCenter = "
    
    # Fix className with trailing spaces
    'className="([^"]+)\s+"\s*$' = 'className="$1"'
    
    # Fix broken template strings with ))}
    "\? 'fill-amber-400 text-amber-400' \)\)\}" = "? 'fill-amber-400 text-amber-400' : 'text-gray-300'}"
    
    # Fix broken className concatenations
    'className="mb-8 last\) =>' = 'className="mb-8 last:mb-0">'
    
    # Fix style).format -> style: 'currency', currency: 'VND' }).format
    "style\)\.format" = "style: 'currency', currency: 'VND' }).format"
    
    # Fix height)' -> height: 200
    "height\)'" = "height: 200"
    
    # Fix orphan );
    '^\s+\);\s*$' = ''
}

Get-ChildItem -Path src -Recurse -Include *.jsx,*.js | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw -Encoding UTF8
    $originalContent = $content
    $changed = $false
    
    foreach ($pattern in $fixes.Keys) {
        if ($content -match $pattern) {
            $replacement = $fixes[$pattern]
            $content = $content -replace $pattern, $replacement
            $changed = $true
        }
    }
    
    if ($changed) {
        Set-Content $file -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Fixed: $($_.Name)"
    }
}

Write-Host "`nPhase 1 completed. Now manually fixing specific files..."
