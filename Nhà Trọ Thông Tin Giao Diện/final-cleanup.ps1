# Final cleanup script to remove all remaining TypeScript syntax

Write-Host "Running final TypeScript cleanup..."

Get-ChildItem -Path src -Recurse -Include *.jsx,*.js | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw -Encoding UTF8
    $originalContent = $content
    
    # 1. Fix "import * from" -> "import * as React from"
    $content = $content -replace 'import \* from "react"', 'import * as React from "react"'
    
    # 2. Remove all standalone interface declarations (single and multiline)
    $content = $content -replace '(?ms)^interface\s+\w+\s*\{[^}]*\}\s*\n?', ''
    $content = $content -replace '(?ms)^export\s+interface\s+\w+\s*\{[^}]*\}\s*\n?', ''
    
    # 3. Remove all standalone type declarations
    $content = $content -replace '(?m)^type\s+\w+\s*=\s*[^;]+;\s*$', ''
    $content = $content -replace '(?m)^export\s+type\s+\w+\s*=\s*[^;]+;\s*$', ''
    
    # 4. Remove inline type annotations like }: { children: ReactNode }
    $content = $content -replace '(\})\s*:\s*\{[^}]+\}', '$1'
    
    # 5. Remove function parameter types more aggressively
    # Pattern: (param: Type) -> (param)
    $content = $content -replace '\(([^:)]+):\s*[^\)]+\)', '($1)'
    
    # 6. Remove return type annotations
    $content = $content -replace '\)\s*:\s*[A-Za-z\[\]<>\.\|\&\s]+\s*=>', ') =>'
    $content = $content -replace '\)\s*:\s*[A-Za-z\[\]<>\.\|\&\s]+\s*\{', ') {'
    
    # 7. Remove array typing: const x: Type[] = 
    $content = $content -replace '(const|let|var)\s+(\w+)\s*:\s*[A-Za-z<>\[\]\{\}\|\&\s\.]+\[\]\s*=', '$1 $2 ='
    
    # 8. Remove object typing: const x: { key: Type }[] =
    $content = $content -replace '(const|let|var)\s+(\w+)\s*:\s*\{[^}]+\}\[\]\s*=', '$1 $2 ='
    
    # 9. Remove simple const typing: const x: Type =
    $content = $content -replace '(const|let|var)\s+(\w+)\s*:\s*[A-Za-z<>\[\]\.\|\&\s]+\s*=', '$1 $2 ='
    
    # 10. Remove 'as' type assertions
    $content = $content -replace '\s+as\s+''[^'']+''', ''''
    $content = $content -replace '\s+as\s+"[^"]+"', '""'
    $content = $content -replace '\s+as\s+[A-Za-z<>\[\]]+', ''
    
    # 11. Remove non-null assertions
    $content = $content -replace '(\w+)!\.', '$1.'
    $content = $content -replace '(\))!', '$1'
    
    # 12. Remove generic types from hooks
    $content = $content -replace '(useState|useRef|useMemo|useCallback|useContext|createContext)<[^>]+>', '$1'
    
    # 13. Fix array destructuring with types: const [x, number] = -> const [x] =
    $content = $content -replace '(\[[\w\s,]+),\s*[A-Za-z\[\]<>]+\s*\]', '$1]'
    
    # Only write if changed
    if ($content -ne $originalContent) {
        Set-Content $file -Value $content -Encoding UTF8 -NoNewline
        Write-Host "Cleaned: $($_.Name)"
    }
}

Write-Host "`nFinal cleanup completed!"
Write-Host "Run 'npm run dev' to test the application."
