FROM nginx:latest

# debian mirror update fix
RUN apt-get clean

RUN apt-get update && apt-get install -y curl git build-essential nodejs nodejs-legacy npm

COPY default.conf /etc/nginx/conf.d/
COPY html /usr/share/nginx/html

WORKDIR /usr/share/nginx/html
RUN npm install npm -g
RUN npm install -g bower
RUN bower --allow-root install -g

# Open port and start nginx
EXPOSE 80
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
