# web-push-server

## Description

A simple Web Push Server

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# compile and run prod compiled
$ npm run prestart:prod
$ node dist/main.js
```

## Mongo database

Localhost dev with docker :

```bash
docker run -p 27017:27017 --name push-mongo -d mongo
```

## Generate VAPID keys

```bash
./node_modules/web-push/src/cli.js generate-vapid-keys --json
```

## Env file example

developpment.env :

```bash
MONGO_URL=mongodb://localhost:27017/push-server
AUTH_SECRET=this_is_my_secret_key
VAPID_SUBJECT=mailto:toto@gmail.com
VAPID_PUBLIC_KEY=BBYNKgeEXi0BMbfglL_SUl-Xf2To9EVPT1Qij5J3y-x3d95LylSzdGJT3trLjW4q_eRo9aAZeVezcOK4JpxmBbI
VAPID_PRIVATE_KEY=bETOhh-57fLf1MaEPciA9Mi1pTZYsBIHFwIV67KJcr4
NOTIFME_HISTORY=true
NOTIFME_HISTORY_URL='http://localhost'
NOTIFME_HISTORY_AUTH='123456789'
```

## Example Web Client Subscribe



