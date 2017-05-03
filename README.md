# Beer Locker: Building a RESTful API With Node based on the koa

This project which will help me to understand "How will make Building a RESTful API With Node?"

## Step 1

I did know about utility  Nodemon. This is a utility that is monitor for any changes in you source and automatically restart my server. It is useful utility.

## Step 2

I will have learned how to connect to a MongoDB, used Mongoose for object modeling.

### Install MongoDB
```
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 0C49F3730359A14518585931BC711F9BA15703C6
$ echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.4.list
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
$ sudo service mongod start
```
### Run client of MongoDB for check work of MongoDB
```
$ mongo
```
### Some commands of MongoDB

* version() - show version MongoDB

* show dbs - show all databases

* use <name> - use database by name (use my_base)

* show collections

* db.<collection name>.find() - show contain collection (
db.people.find())

* db.<collection name>.drop() - remove collection (db.users.drop())

* db.<collection name>.remove({}) - remove contain of collection db.users.remove({})

* help - information about the commands

## Step 3
I have implemented GET, PUT, POST, and DELETE endpoints (full CRUD).

## Step 4

Code cleanup and restructuring (Refactoring). Create ***controllers***
```
project
├── controllers
│   ├── beer.js
│   └── user.js
├── models
│   ├── beer.js
│   └── user.js
├── package.json
├── README.md
└── server.js
```

## Step 5

User Controller for authorized of users. User Controller included POST / GET request and user model of MongoDB.

## Step 6

Auth Controller for authentication of users. It is middleware between user model and everything request for access only user

## Step 7

The client conception added for security of application.

## Step 8

Create another model that will store our authorization codes. These are the codes generated in the first part of the OAuth2 flow. These codes are then used in later steps by getting exchanged for access tokens.

## Step 9

Create the model that will store our access tokens. Access tokens are the final step in the OAuth2 process.

## Step 10

A simple user interface created using ejs.

## Schema how work OAuth Server
```
app ---[GET запрос по ссылке с какой информацией?] --------------> oauth2
                                                                     |
app  < -- [редирект на стороне сервера ресурс? / с code]-------------+
 |
 |  [code — идентификатор Юзера в oauth2, который нужен app (client)]
 |  [              чтобы получить Токен                             ]
 |
app --[POST запрос client_id, client_secret, code, redirect_uri]-->oauth2
                                                                     |
                                     +----------------------------------+
                                     |     исходя из code сервер oauth2 |
app <--[ token / POST? ]-------------|                                  |
                                     |  отвечает и отдает нужный токен  |
                                     +----------------------------------+
```
1) сразу переброс на сервер oauth2. (login / password)
model: app -- user / oauth2 -- client (app)
2) oatuth2  - user and clients
   app -  clients - 1 / client_secret -1

[Beer Locker: Building a RESTful API With Node](http://scottksmith.com/blog/2014/05/02/building-restful-apis-with-node/)
