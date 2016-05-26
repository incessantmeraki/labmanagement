
## About

A simple web app written using koa.js that performs CRUD operations on a MySQL database.

## Features

The main page of the website provides the user with log in page. Here user can 
select one among three user type: admin, student and teacher. Different user 
type has different features available 

__Admin__
- Add , Remove, Edit Students Account 
- Add, Remove , Edit Teachers Account 
- Add, Remove , Edit Subjects 
- Add, Remove, Edit Questions inside particular Subject 
- Add , Remove, Edit Batches 
- Assign Students, Teachers and Subjects to Batches 
 
__Students__ 
- View Subjects and Questions assigned to each onez
- View Batch Number and Teacher assigned to that batch 
 

__Teachers__ 
- View Subjects and Questions assigned to each one
- View Batch Numbers and Students assigned to that batch 


## Installation

 **Configure Database**

Create a database named  __*labmanagement*__ and modify the file __*db-development.json*__ (is inside config directory).Then to create tables and fill in some data execute commands shown below:

```bash
labmanagement/db:$ mysql -u root -p
mysql> use labmanagement
mysql> source create
mysql> source insert
```

After database is set type in following commands to run the web app.

```bash
labmanagement:$ npm install
labmanagement:$ node app .js

```

## License

MIT
