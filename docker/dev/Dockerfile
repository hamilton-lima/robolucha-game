# prepare builder
FROM node as builder

RUN mkdir /usr/src/app
COPY package.json /usr/src/app
WORKDIR /usr/src/app
RUN npm install

COPY . /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH
RUN node ./node_modules/@angular/cli/bin/ng build --configuration=development

# base image
FROM nginx:alpine
COPY --from=builder /usr/src/app/dist/www /usr/share/nginx/html
RUN ls -alh /usr/share/nginx/html
COPY docker/dev/nginx.conf /etc/nginx/nginx.conf
