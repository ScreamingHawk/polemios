call npm install

set POLEMIOS_PORT=3000

set POLEMIOS_LOG_LEVEL=debug

set POLEMIOS_DB_HOST=localhost
set POLEMIOS_DB_USER=admin
set POLEMIOS_DB_SECRET=admin
set POLEMIOS_DB_SCHEMA=polemiosDB
set POLEMIOS_DB_MAX_CONNECTIONS=10
set POLEMIOS_DB_DEBUG=false
set POLEMIOS_DB_RESET=true

set POLEMIOS_SESSION_SECRET=polemiossecret

set NODE_ENV=development

nodemon ./bin/www
