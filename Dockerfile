FROM node:22-alpine AS builder
WORKDIR ./
COPY . .
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    gcc
RUN npm install
RUN npm run docs:build
RUN ls

FROM nginx
WORKDIR /usr/share/nginx/html/
COPY --from=builder ./src/.vuepress/dist ./
RUN ls

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
