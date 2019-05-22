# prepare builder
FROM node as builder
RUN mkdir /usr/src/app
COPY . /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
WORKDIR /usr/src/app

RUN npm install
# RUN ng build --prod --source-map=false
RUN node --max_old_space_size=1024 ./node_modules/@angular/cli/bin/ng build --prod 

# base image
FROM nginx:alpine
COPY --from=builder /usr/src/app/dist/www /usr/share/nginx/html
RUN ls -alh /usr/share/nginx/html
COPY docker/production/nginx.conf /etc/nginx/nginx.conf
