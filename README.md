
# Planning poker service

## Installing
```bash
npm install
// Install vue cli globally
npm install -g @vue/cli @vue/cli-service-global
// Install cli
cd client && npm install
```

## Run
```bash
// Run server
npm run start
// Run cli dev
npm run watch-cli
// Run cli build
npm run build-cli
```

## Deploy

```
sudo snap install --classic heroku
heroku login
git remote add heroku https://git.heroku.com/ppsrv.git
git push --force heroku [from:branch]:[to:branch]
```

## Specs
```
1. User can join or create room at landing page.
2. If user creates room, he may set a pass, and he is considered to be its owner.
3. If user visits a room, he may choose name, and should input pass if it is set.
4. Owner can delete room and kick any other user any time.
TODO describe later process

```