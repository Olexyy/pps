
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
3. Visitor shuold set name and pass if required.
4. Owner can kick any other user/close room.
```

## TODO OPTIONS:
```md
1. dynamic description OK
2. control flow only owner OK
3. assign admin -> TODO (may move process, set topic, kick (non owner))
4. options:
    - sound configurable -> TODO OK
    - remove play sound button OK  
    - recommended min / max -> TODO OK
    - OPTIONS button for owner -> OK
5. set state `result` on any unvoted == false, remove any unvoted prop OK
6. room name validation??? OK
7. debug console log in server and client ->
8. pass validation -> OK
9. add enter button on non error dialogs ->
10. pass on enter should be pass
```
## Bugs
```md
1. 
```