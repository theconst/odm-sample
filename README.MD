# Demonstration application for Cache ODB
This is a demo application that demonstrates usage of Cache ODM.

## Prerequisites

- Installed Node.js 8+ - https://nodejs.org/en/
- Installed CMake - https://cmake.org/download/
- Installed gcc6 (or higher) for Linux machines
- Visual Studio Build tools https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2017 for Windows.
- Configured and installed connetion to Intersystems Cache via ODBC

You also need to have preistalled samples for Intersystems Cache which come with a standard distribution

### Build steps for MacOS

1. Install node.js: https://nodejs.org/en/
2. Install homebrew (it makes a lot of steps a lot more easier)
   > ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" < /dev/null 2> /dev/null
3. Install unixodbc
   > brew install unixodbc
4. Check that you have latest of gcc installed
   > gcc --version
   Version should be 6.3 or higher in order to compile the binaries properly.
   If not, follow the steps on https://discussions.apple.com/thread/8336714 
   and then https://stackoverflow.com/questions/42354964/linking-gcc-to-gcc-6-using-brew.
5. Download Cache ODBC driver:
   ftp://ftp.intersys.com/pub/cache/odbc/2018/ODBC-2018.1.0.184.0-macx64.tar.gz
   Untar the archive and run `./ODBCinstall` in the installation directory
6. Edit configuration files `odbc.ini` and `odbcinst.ini` to point to the location where the 
   library was installed.
7. Change network host in `odbc.ini` to point to the Cache instance (typically 127.0.0.1) if 
   you are running DB on the same host. You may also tweak and adjust other configuration if
   you find it necessary (e. g. you are running on non-default port).
8. Do not forget to check that:
    - gcc --version outputs version greater than `6`
    - node --version outputs version greater than `8`
    - cmake --version is greater than `3.2`
    - You have installed unixodbc and paths you have set up in `odbc.ini` and `odbcinst.ini` are correct

# Build steps for linux

On debian-like distros follow the steps in `Dockerfile`

## Running the application

- Set environmental variable "DSN" to be equal to DSN connection string and run npm start, for example
> 
> export DSN="DSN=CacheWinHost"
> npm start
>
on a Linux machine or 
>
> set DSN="DSN=CacheWinHost"
> npm start
>
on a Windows machine.

The application should be accessible on http://localhost:8080/index.html.

## Using docker container

Check your docker version. Docker version supported is `> 17.0`

Run:
> docker build -t cache-node
> docker run
`Note: You may need to run the above commands as a superuser`.

Application should be accible on `http://localhost:8080/index.html`.

# Using ODM or simply ODBC connection

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