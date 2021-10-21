FROM node:10-alpine AS builder
ENV http_proxy=http://pxys2s1.true.th:80 https_proxy=http://pxys2s1.true.th:80
RUN apk add --update curl  && rm -rf /var/cache/apk/*
WORKDIR /usr/src
COPY package.json ./
RUN npm i --production
COPY . .

FROM node:10-alpine
WORKDIR /usr/src
COPY --from=builder /usr/src .
EXPOSE 3001
CMD ["npm", "run", "serve"]