$ErrorActionPreference = "Stop"
$env:GH_TOKEN="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"
git init
git config user.name "AI Builder"
git config user.email "mr.jwswain@gmail.com"
git add .
git commit -m "Fresh commit of site codebase without bad history"
git branch -M main
git remote add origin "https://${env:GH_TOKEN}@github.com/3000Studios/findmerates.git"
git push -u origin main --force
