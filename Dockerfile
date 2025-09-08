# syntax=docker/dockerfile:1.18.0
ARG NODE_VERSION=22

FROM node:${NODE_VERSION}-alpine AS build

ARG BUN_VERSION=1.2.21

WORKDIR /build

RUN apk --no-cache add bash curl unzip && \
 curl -fsSL https://bun.sh/install | bash -s -- bun-v${BUN_VERSION}

ENV PATH="${PATH}:/root/.bun/bin"

ENV NODE_OPTIONS="--max-old-space-size=8192"

COPY bun.lock package.json ./

RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

COPY . .
RUN --mount=type=cache,target=/root/.cache \
    bun run build

RUN --mount=type=cache,target=/root/.bun/install/cache \
  rm -rf node_modules && \
  bun install --frozen-lockfile --production

RUN curl -sf https://gobinaries.com/tj/node-prune | sh && \
    node-prune

FROM node:${NODE_VERSION}-alpine AS distribution

ENV NODE_ENV="production"

WORKDIR /app

# ADJUST: Copy application build artifacts.
COPY --from=build --chown=node:node /build/node_modules ./node_modules
COPY --from=build --chown=node:node /build/.output ./.output
COPY --from=build --chown=node:node /build/package.json .

USER node

EXPOSE 3000

CMD [ "node", ".output/server/index.mjs" ]
