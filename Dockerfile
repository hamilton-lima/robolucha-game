# prepare builder
FROM node:13.8.0 as builder

RUN mkdir -p /usr/src/app
COPY package.json /usr/src/app
WORKDIR /usr/src/app
RUN npm install

COPY . /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH
# RUN ng build --prod --source-map=false
RUN node ./node_modules/@angular/cli/bin/ng build --prod 

# base image
FROM nginx:alpine
COPY --from=builder /usr/src/app/dist/www /usr/share/nginx/html
RUN ls -alh /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
