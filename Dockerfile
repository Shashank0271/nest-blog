FROM node:24.12.0-bookworm-slim AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY nest-cli.json tsconfig*.json ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

FROM node:24.12.0-bookworm-slim AS runtime

ENV NODE_ENV=development
WORKDIR /app

COPY --from=build --chown=node:node /app/package.json ./package.json
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

USER node
EXPOSE 3000

CMD ["node", "dist/main.js"]