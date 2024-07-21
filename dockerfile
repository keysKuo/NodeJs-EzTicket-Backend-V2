FROM node:18.16.0-alpine3.17

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 4000

CMD [ "npm", "start" ]