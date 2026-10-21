# Converts each Markdown document in this folder to standalone HTML with pandoc.
$ErrorActionPreference = 'Stop'
Push-Location $PSScriptRoot
try {
    Get-ChildItem -Filter *.md | ForEach-Object {
        $out = [System.IO.Path]::ChangeExtension($_.Name, '.html')
        pandoc $_.Name --standalone --toc --toc-depth=2 --from markdown --to html5 --output $out
        Write-Output "Built $out"
    }
}
finally {
    Pop-Location
}
