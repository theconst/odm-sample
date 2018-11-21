# Demonstration application for Cache ODB
This is a demo application that demonstrates usage of Cache ODM.

## Prerequisites

- Installed Node.js 6+ - https://nodejs.org/en/
- Configured and installed connetion to Intersystems Cache via ODBC

You also need to have preistalled samples for Intersystems Cache which come with a standard distribution
to run the sample

## Launching the application

### Installing prerequisites for MacOS

1. Install node.js: https://nodejs.org/en/
2. Install homebrew (it makes a lot of steps a lot more easier)
   > ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" < /dev/null 2> /dev/null
3. Install unixodbc and gcc@6
   > brew install unixodbc
   > brew install gcc@6
4. Download Cache ODBC driver:
   ftp://ftp.intersys.com/pub/cache/odbc/2018/ODBC-2018.1.0.184.0-macx64.tar.gz
   Untar the archive and run `./ODBCinstall` in the installation directory
5. Edit configuration files `odbc.ini` and `odbcinst.ini` to point to the location where the 
   ODBC library was installed.
6. Copy `odbc.ini` and `odbcinst.ini` to `/usr/local/etc` folder.
7. Change network host in `odbc.ini` to point to the Cache instance (typically 127.0.0.1) if 
   you are running DB on the same host. You may also tweak and adjust other configuration if
   you find it necessary (e. g. you are running on non-default port).

### Installing prerequisites on Linux

1. Install node.js: https://nodejs.org/en/
2. Install Cache ODBC driver for linux:
ftp://ftp.intersys.com/pub/cache/odbc/2018/ODBC-2018.1.0.184.0-lnxrhx64.tar.gz.
Untar the archive and run `./ODBCinstall` in the installation directory.
You may use `odbc-install.sh` in the `scripts` directory.
3. Edit configuration files `odbc.ini` and `odbcinst.ini` to point to the location where the 
   ODBC library was installed.
4. Copy `odbc.ini` and `odbcinst.ini` to `/etc` folder. 
5. Change network host in `odbc.ini` to point to the Cache instance (typically 127.0.0.1) if 
   you are running DB on the same host. You may also tweak and adjust other configuration if
   you find it necessary (e. g. you are running on non-default port).

### Installing prerequisites on Windows

1. Install node.js: https://nodejs.org/en/
2. Configure ODBC driver as per https://docs.intersystems.com/latest/csp/docbook/DocBook.UI.Page.cls?KEY=BGOD_winodbc

No other addtional steps are required for Windows users.

### Running the sample application

When you have installed the prerequisites and checked that DSN works, run:

- Set environmental variable "DSN" to be equal to DSN connection string and run npm start, for example
> 
> export DSN="DSN=CacheWinHost"
> npm start
>
on a Linux (MacOS) machine or 
>
> set DSN="DSN=CacheWinHost"
> npm start
>
on a Windows machine.

The application should be accessible on http://localhost:8080/static/index.html.


## Using docker container

`Warning: work in progress`

Check your docker version. Docker version supported is `> 17.0`

Run:
> docker build -t cache-node
> docker run
`Note: You may need to run the above commands as a superuser`.

Application should be accible on `http://localhost:8080/static/index.html`.

# Using ODM or ODBC connectivity

You may use direct access to ODBC connector:
```javascript
const cacheodbc = require('cacheodbc');
const connection = new cacheodbc.ODBCConnection();

connection.connect("DSN=CacheHost", err => {
    if (err) {
        throw new Error("Cannot connect to API");
    }
    connection.query("SELECT * FROM Table", (err, value) => {
        console.log(`Value: ${value}`);
    });
});
```

If you want to use only raw ODBC connector (without promisification and ODM facilities),
just add print `npm install cacheodbc` and visit https://github.com/theconst/aodbc
for a detailed overview.

Alternatively you may use ODM facilities (experimental):
```javascript
/* ... create ODBC isntance, see db.js */
    const db = require('./db');
    const models = require('./models');
    const Session = db.Session;
    const Company = models.Company;


   Session.exec(() => Company.existsId(id)
        .tap(exists => exists || notFoundError('company'))
        .flatMap(() => Employee.findBy({'Company': id})))
    .tap(company => res.json(company));
})
```

See source code for more details.
