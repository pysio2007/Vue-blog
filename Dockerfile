FROM node:22-alpine AS builder
WORKDIR ./
COPY . .
RUN apk add --no-cache \
    python3 \
    make \
    git \
    g++ \
    gcc
RUN npm install
RUN npm run docs:build
RUN ls

FROM nginx
WORKDIR /usr/share/nginx/html/
COPY --from=builder ./src/.vuepress/dist ./
COPY nginx.conf /etc/nginx/conf.d/default.conf

RUN mkdir -p /etc/nginx/ssl
VOLUME ["/etc/nginx/ssl"]
EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
