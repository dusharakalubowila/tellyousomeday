# If you have DigitalOcean CLI (doctl) installed:

# 1. Login to DigitalOcean CLI
doctl auth init

# 2. Create the app using the spec file
doctl apps create --spec .do/backend-app.yaml

# 3. Check deployment status
doctl apps list
