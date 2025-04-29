FROM azeupvprddvoacr01.azurecr.io/node:23-alpine AS BUILD_IMAGE

WORKDIR /app

RUN apk add --no-cache shadow=4.16.0-r1

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY package.json package-lock.json* ./

COPY .npmrc .npmrc

RUN npm install --save --legacy-peer-deps

COPY . .

ARG ENV_NODE
ENV ENV_NODE=$ENV_NODE
RUN echo "El valor de mi ENV_NODE: $ENV_NODE"
COPY ${ENV_NODE} .env.production

RUN npm run build

FROM azeupvprddvoacr01.azurecr.io/node:23-alpine

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

USER appuser

COPY --from=BUILD_IMAGE /app/node_modules ./node_modules
COPY --from=BUILD_IMAGE /app/public ./public
COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=BUILD_IMAGE --chown=nextjs:nodejs /app/.next/static ./.next/static

ARG PORT
ENV PORT=$PORT
EXPOSE ${PORT}

CMD ["node", "server.js"]