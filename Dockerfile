FROM node:23 AS builder
WORKDIR ./
COPY . .
RUN npm install
RUN npm run docs:build
RUN ls

FROM nginx
WORKDIR /usr/share/nginx/html/
COPY --from=builder ./src/.vuepress/dist ./
RUN ls

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
