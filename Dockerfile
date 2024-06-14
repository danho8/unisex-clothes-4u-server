###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:16-alpine AS development

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN npm install --no-optional && npm cache clean --force

COPY --chown=node:node . .

###################
# BUILD FOR PRODUCTION
###################

FROM node:16-alpine AS build

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /home/node/app/node_modules ./node_modules

COPY --chown=node:node . .

ENV NODE_ENV production

RUN npm run build

RUN npm ci --only=production && npm cache clean --force

USER node

###################
# PRODUCTION
###################

FROM node:16-alpine AS production

WORKDIR /home/node/app

COPY --chown=node:node --from=build /home/node/app/node_modules ./node_modules
COPY --chown=node:node --from=build /home/node/app/dist ./dist
COPY --chown=node:node --from=build /home/node/app/package*.json ./

RUN mkdir -p ./logs
RUN chown -R node ./logs

USER node
EXPOSE 3000
CMD [ "node", "dist/main" ]
