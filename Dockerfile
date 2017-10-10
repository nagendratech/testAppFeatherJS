FROM node:8-alpine
RUN apk add --update bash && rm -rf /var/cache/apk/*
RUN apk add --update git && rm -rf /tmp/* /var/cache/apk/*

WORKDIR /var/www/

ENV NODE_ENV=development
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /var/www/

COPY . /var/www

EXPOSE 3030
VOLUME /var/www

CMD ["npm", "run", "dev"]
