
# Ilp

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

## Deploy initial
```bash
sudo snap install --classic heroku
heroku login
git remote add heroku https://git.heroku.com/il-p.git
heroku git:remote -a il-p
```

## Deploy
```bash
git push heroku [from:branch]:[to:branch]
```

## Functions:
```md
1. User can join or create room.
2. Owner of room can set password.
3. Visitor should set name and pass if required.
4. Owner can kick any other user/close room.
```
