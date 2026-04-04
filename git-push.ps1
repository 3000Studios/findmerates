$env:GH_TOKEN="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"

gh auth setup-git

git init
git config user.email "mr.jwswain@gmail.com"
git config user.name "AI Assistant"

git add .
git commit -m "Initialize project and set up Cloudflare Pages deployment"

git branch -M main
git remote add origin https://github.com/3000Studios/findmerates.git
git push -u origin main --force
