# Demonstration application for Cache ODB
This is a demo application that demonstrates usage of Cache ODB.

## Prerequisites

- Installed Node.js 8+ - https://nodejs.org/en/
- Installed CMake - https://cmake.org/download/
- Installed gcc6 (or higher) for Linux machines
- Visual Studio Build tools https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2017 for Windows.
- Configured and installed connetion to Intersystems Cache via ODBC

You also need to have preistalled samples for Intersystems Cache which come with a standard distribution

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

The application should be accessible on http://localhost:8080/index.html