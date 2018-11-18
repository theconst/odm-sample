#
# Template for launching application in Docker containers
#
FROM debian:stretch

EXPOSE 8080:8080

# For you, mac OS users
ARG HOST=docker.for.mac.localhost
ARG NODE_VERSION=10.x

# DSN - connection string where username and password is specified
# Do not forget to add your configuration to odbc.ini
ENV DSN=CacheHost

RUN apt-get update
RUN apt-get install -y \
    gcc \
    curl \
    cmake \
    unixodbc-dev \
    wget

# You can also use 8.x
RUN curl -sL https://deb.nodesource.com/setup_${NODE_VERSION} | bash - \ 
    && apt-get install -y nodejs
RUN npm i npm@latest -g

# This is an application directory
RUN mkdir -p /app
WORKDIR /app

COPY ./scripts ./scripts
RUN chmod +x ./scripts/odbc-install.sh && ./scripts/odbc-install.sh

COPY . .
RUN chmod +x ./scripts/setenv.sh && ./scripts/setenv.sh
RUN cp -rf "config/" /etc/

RUN npm install --unsafe-perm

ENTRYPOINT [ npm start ]