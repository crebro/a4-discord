FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . . 

RUN npx prisma generate

RUN npm run build

COPY ./prisma ./dist/

WORKDIR /usr/src/app/dist

ARG database_url
ARG token

ENV DATABASE_URL=$database_url
ENV TOKEN=$token

CMD ["node", "index.js"]

