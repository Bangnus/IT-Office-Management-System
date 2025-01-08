# CMS Template

# In this project is a Content Management System Templete

Feature
- authenticate using passport
- UX/UI

Front-End

```
📦 framwork
 ┗ vite + react
📦 lib
 ┣ state management in react
 ┃  ┣ redux 
 ┃  ┣ react-redux 
 ┃  ┗ redux-thunk
 ┣ axios -> http and https req
 ┗ react-router-dom -> manage route in project
📦 css framwork and lib style
 ┣ tailwindcss
 ┣ material tailwindcss
 ┗ mui
    ┣ material UI
    ┗ Data Grid

``` 

Back-End

```
📦 runtime
 ┗ nodejs
📦 lib
 ┣ nodemon -> automatic restarting
 ┣ express -> api server
 ┣ passport.js -> auth
 ┣ cors -> http and https middleware
 ┣ prisma -> database orm
 ┣ jwt -> jsonwebtoken
 ┣ redis -> client cache in memory
 ┣ pgsql -> pg database
 ┗ mssql -> connect database on promise
``` 

# Quick start

When Clone this project after give open terminal or command line on your computer and cd to path of project and used command
```
docker compose up

or

using container run is a background on os
docker compose up -d --build
```

When container runing used ssh to container for migration schema of prisma go in the database engine
```
is a using ssh connect to container
docker exec -it <container name or container id> sh
```

When connect to container success and used command then will do migration database
```
npx prisma migrate dev --name <migrate name>
```

Endpoint of all services in project
```
fontend -> 127.0.0.1:5173
backend -> 127.0.0.1:3000
redis gui -> 127.0.0.1:8001
redis cli -> 127.0.0.1:6379
pg database -> 127.0.0.1:5432
```
