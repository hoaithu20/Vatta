ARG NODE_VERSION=14

FROM node:${NODE_VERSION}-alpine as build
RUN echo "Node $(node -v) / NPM v$(npm -v) / YARN v$(yarn -v)"
WORKDIR /usr/src/app
COPY ./package.json ./yarn.lock ./
RUN yarn install
COPY ./tsconfig.json ./tsconfig.build.json ./nest-cli.json ./
COPY ./src ./src/
RUN yarn build

FROM node:${NODE_VERSION}-alpine as deps
WORKDIR /usr/src/app
COPY ./package.json ./yarn.lock ./
RUN yarn install --prod

FROM node:${NODE_VERSION}-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./
COPY --from=deps /usr/src/app/node_modules ./node_modules/
COPY ./static ./static/
# COPY ./.env.dev ./
COPY ./.env ./

ENV DB_HOST db_host
# ENV DB_NAME cam_cms
# ENV DB_PORT 3306
# ENV DB_USER root
ENV DB_PASSWORD thuabcxyz
EXPOSE 3000
CMD ["node", "main.js"]