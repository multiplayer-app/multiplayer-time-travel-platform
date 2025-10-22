FROM node:24-slim AS build

ARG NODE_ENV=production

WORKDIR /usr/src/app

COPY . .
COPY package-lock.json ./
COPY package.json ./
COPY tsconfig.json ./
COPY ./src/ ./src
COPY ./doc/ ./doc

RUN NODE_ENV=development npm i
RUN npm run build

FROM node:24-slim

ARG SERVICE_VERSION
ENV SERVICE_VERSION=$SERVICE_VERSION

WORKDIR /usr/src/app

EXPOSE 3000
COPY --from=build /usr/src/app /usr/src/app

CMD ["npm", "start"]
