# Stage One: Build
FROM alpine AS builder
WORKDIR /app
RUN apk add --no-cache --update nodejs npm
COPY ./backEndExpress/package*.json .
RUN npm install --production

# Stage Two: Production
FROM alpine
WORKDIR /app
RUN apk add --no-cache --update nodejs
COPY --from=builder /app/node_modules ./node_modules
COPY ./backEndExpress .
EXPOSE 3000
CMD [ "node", "server.js" ]

# This will link github repo to github package
LABEL org.opencontainers.image.source https://github.com/Sajjal/period-tracker