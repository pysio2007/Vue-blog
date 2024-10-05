FROM docker.akaere.online/node:18 as builder
WORKDIR ./
COPY . .
RUN npm install
RUN npm run docs:build
RUN ls

FROM docker.akaere.online/nginx
WORKDIR /usr/share/nginx/html/
COPY --from=builder ./src/.vuepress/dist ./
RUN ls

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
