FROM node:10
RUN apt update && apt install -y nginx

WORKDIR /opt/webclient
COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./.npmrc ./
RUN npm i
COPY ./ ./
RUN mkdir -p ./build && mv ./prod_statics ./build/prod_statics
RUN npm run build

WORKDIR /opt/webclient
COPY ./nginx.conf /etc/nginx/conf.d/
RUN mkdir -p /var/www/html &&  mv ./build/* /var/www/html/
WORKDIR /opt/webclient
RUN rm -rf /opt/webclient
CMD ["nginx", "-g", "daemon off;"]
