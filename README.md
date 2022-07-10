
# IL planning
IL planning system.

## Installing
```bash
# Install server deps.
npm install / yarn install
# Install cli deps.
cd client
npm install / yarn install
```

## Run local
```bash
// Run server
npm run start / yarn run start
// Run server with debug
npm run start-dev / yarn run start-dev
// Run cli dev watch
npm run watch-cli / yarn run watch-cli
// Run cli prod build
npm run build-cli / yarn run build-cli
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

## Features:
```md
1. User can join or create room.
2. Before or after room is created it may be configured:
   - sound on / off
   - higher proposal estimation
   - password (only before room creation) 
3. Owner of room can:
   - configure room
   - delete room
   - set admin role to any user
   - has all admin rights
4. Admin and owner can:
   - kick any user
   - control vote process:
    - set topic
    - start / stop / reset voting
3. User can / should:
   - enter password to join if required
   - enter name for voting 
   - vote
```
