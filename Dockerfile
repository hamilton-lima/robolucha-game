# prepare builder
FROM node as builder

RUN mkdir /usr/src/app
COPY . /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
WORKDIR /usr/src/app

RUN npm install
RUN ng build --prod 

# base image
FROM nginx:alpine

# copy artifact build from the 'build environment'
COPY --from=builder /usr/src/app/dist/robolucha-game /usr/share/nginx/html