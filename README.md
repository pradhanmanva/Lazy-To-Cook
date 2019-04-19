# Lazy To Cook
App that lets people order food from restaurants and get it delivered at their doorstep.

#### Technology Stack
1. Node.js
2. MySQL
3. Express.js
4. Angular.js

##### Steps To Setup Project:
1.  Install [Node](https://nodejs.org/en/), NPM and [MySQL](https://dev.mysql.com/downloads/) in your machine.
2.  Clone this repository.
3.  Open terminal and change current working directory to <root>/app
4.  Start the MySQL server.
5.  Edit the `db_init_queries.json` file with any queries you want to add. 
6.  Run `npm run setup` (Use `sudo`, if required)

Now, all the required backend dependencies will the installed and the database will be created.

**Note:** Please use this command only for first installation. Do not use it on production database as it drops existing tables from database and re-creates them. If you are adding a new dependency, use `npm install` command to update dependencies.

##### To install the client:
1.  Open terminal and change current working directory to <root>/app/src/client
2.  Run `npm install` and then `npm run build` (Use `sudo`, if required.)
3.  Open browser and go to the url: http://localhost:<backend_port>/app/

##### To run client in dev mode:
1.  Open terminal and change current working directory to <root>/app/src/client
2.  Run `npm install` and then `npm start` (Use `sudo`, if required.)
3.  Open browser and go to the url: http://localhost:3000