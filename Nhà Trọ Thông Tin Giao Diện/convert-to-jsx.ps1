# Safe TypeScript to JavaScript conversion script
# This script will be more conservative and only remove obvious type annotations

Write-Host "Starting TypeScript to JavaScript conversion..."

Get-ChildItem -Path src -Recurse -Include *.tsx,*.ts | ForEach-Object {
    $file = $_.FullName
    $content = Get-Content $file -Raw -Encoding UTF8
    
    # Step 1: Remove standalone interface declarations
    $content = $content -replace '(?ms)^export\s+interface\s+\w+\s*\{[^}]*\}\s*\n', ''
    $content = $content -replace '(?ms)^interface\s+\w+\s*\{[^}]*\}\s*\n', ''
    
    # Step 2: Remove standalone type declarations
    $content = $content -replace '(?m)^export\s+type\s+\w+\s*=\s*[^;]+;\s*$', ''
    $content = $content -replace '(?m)^type\s+\w+\s*=\s*[^;]+;\s*$', ''
    
    # Step 3: Remove function parameter types (more carefully)
    # Pattern: (param: Type) or (param: Type, param2: Type)
    $content = $content -replace '(\(|\s)(\w+)\s*:\s*[A-Za-z\[\]<>]+(\s*\)|\s*,)', '$1$2$3'
    $content = $content -replace '(\(|\s)(\w+)\s*:\s*React\.\w+(\s*\)|\s*,)', '$1$2$3'
    
    # Step 4: Remove function return type annotations: ): Type {
    $content = $content -replace '\)\s*:\s*[A-Za-z\[\]<>\.]+\s*\{', ') {'
    $content = $content -replace '\)\s*:\s*JSX\.Element\s*\{', ') {'
    $content = $content -replace '\)\s*:\s*React\.\w+\s*\{', ') {'
    
    # Step 5: Remove "as" type assertions (but keep "as const")
    $content = $content -replace '\s+as\s+[A-Za-z\[\]<>\.]+(?!\s+const)', ''
    
    # Step 6: Remove non-null assertions !.
    $content = $content -replace '(\w+)!\.', '$1.'
    $content = $content -replace '(\))!', '$1'
    
    # Step 7: Remove generic type parameters carefully
    # Only remove from function calls like useState<Type>() -> useState()
    $content = $content -replace '(useState|useMemo|useCallback|useRef|createContext)<[^>]+>', '$1'
    
    # Step 8: Remove variable type annotations: const x: Type =
    $content = $content -replace '(const|let|var)\s+(\w+)\s*:\s*[A-Za-z\[\]<>\.]+\s*=', '$1 $2 ='
    
    # Step 9: Change file extension in imports (but don't change the actual filename yet)
    # We'll handle this separately
    
    # Determine new filename
    $newName = $_.Name -replace '\.tsx$', '.jsx' -replace '\.ts$', '.js'
    $newFile = Join-Path $_.DirectoryName $newName
    
    # Write content and rename
    Set-Content $newFile -Value $content -Encoding UTF8 -NoNewline
    
    # If it's a different name, remove the old file
    if ($file -ne $newFile) {
        Remove-Item $file -Force
    }
    
    Write-Host "Converted: $($_.Name) -> $newName"
}

Write-Host "`nNow fixing import paths..."

# Fix import paths
Get-ChildItem -Path src -Recurse -Include *.jsx,*.js | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -Encoding UTF8
    
    # Replace .tsx and .ts in imports
    $content = $content -replace "import\s+(.+)\s+from\s+['""](.+)\.tsx['""]", "import `$1 from '`$2.jsx'"
    $content = $content -replace "import\s+(.+)\s+from\s+['""](.+)\.ts['""]", "import `$1 from '`$2.js'"
    
    Set-Content $_.FullName -Value $content -Encoding UTF8 -NoNewline
}

Write-Host "Conversion completed!"
