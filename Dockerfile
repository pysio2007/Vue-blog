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

# 创建证书目录并复制证书
COPY ssl/cert.pem /etc/nginx/ssl/cert.pem
COPY ssl/key.pem /etc/nginx/ssl/key.pem
RUN chmod 600 /etc/nginx/ssl/key.pem

EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
