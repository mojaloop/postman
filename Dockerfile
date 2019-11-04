FROM node:10.15.3-alpine

WORKDIR /opt/postman

COPY . /opt/postman/

RUN npm install -g newman