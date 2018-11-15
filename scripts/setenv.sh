#!/usr/bin/env bash
#
# Sets environment for node application
#

echo "Host: ${HOST}"
echo "DSN: ${DSN}"

if [ -z $DSN ]; then
    echo "Specify DSN in the environment"
    exit 1 # DSN not specified
fi

if [ -z $HOST ]; then
    echo "Specify HOST in the environment"
    exit 2 # HOST not specified
fi

CONFIG_FILE="${CONFIG_FILE:-"config/odbc.ini"}"

sed -i -e "s/{{HOST}}/${HOST}/g" $CONFIG_FILE

echo "odbc.ini dump ---->"
cat $CONFIG_FILE
echo "-------------------"