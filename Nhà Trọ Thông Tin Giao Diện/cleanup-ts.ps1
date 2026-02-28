# TypeScript to JavaScript cleanup script
Get-ChildItem -Path src -Recurse -Include *.jsx,*.js | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    
    # Remove interface declarations (multiline)
    $content = $content -replace '(?ms)^interface\s+\w+\s*\{[^}]*\}\s*\n', ''
    
    # Remove type declarations (multiline)
    $content = $content -replace '(?ms)^type\s+\w+\s*=\s*\{[^}]*\}\s*;?\s*\n', ''
    
    # Remove type declarations (single line)
    $content = $content -replace '(?m)^type\s+\w+\s*=\s*[^;]+;\s*\n', ''
    
    # Remove function parameter types: (param: Type)
    $content = $content -replace '(\w+)\s*:\s*[A-Za-z<>\[\]\|\&\{\},\s\.]+(?=[,\)])', '$1'
    
    # Remove function return types: ): Type => 
    $content = $content -replace '\)\s*:\s*[A-Za-z<>\[\]\|\&\{\},\s\.]+(\s*=>)', ')$1'
    $content = $content -replace '\)\s*:\s*[A-Za-z<>\[\]\|\&\{\},\s\.]+(\s*\{)', ') $1'
    
    # Remove generic types: <Type>
    $content = $content -replace '<[A-Za-z<>\[\]\|\&\{\},\s\.]+>', ''
    
    # Remove type assertions: as Type
    $content = $content -replace '\s+as\s+[A-Za-z<>\[\]\|\&\{\},\s\.]+', ''
    
    # Remove non-null assertions: !
    $content = $content -replace '(\w+)!(?=\.|\))', '$1'
    
    # Remove const type assertions: as const
    $content = $content -replace '\s+as\s+const', ''
    
    # Remove variable type annotations: const x: Type = 
    $content = $content -replace '(const|let|var)\s+(\w+)\s*:\s*[A-Za-z<>\[\]\|\&\{\},\s\.]+\s*=', '$1 $2 ='
    
    Set-Content $_.FullName -Value $content -NoNewline
}

Write-Host "TypeScript cleanup completed!"
