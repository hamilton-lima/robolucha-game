FROM node

RUN npm install -g @angular/cli

RUN mkdir /usr/src/app
COPY package.json /usr/src/app
WORKDIR /usr/src/app
RUN npm install

COPY . /usr/src/app

ENV PATH /usr/src/app/node_modules/.bin:$PATH
EXPOSE 4200
ENTRYPOINT nohup ng serve --poll=1 --host 0.0.0.0 --port 4200 --disable-host-check 2>&1 >> /var/log/ng.log & tail -f /var/log/ng.log
