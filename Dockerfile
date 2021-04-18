FROM ubuntu:18.04

RUN apt update && apt autoremove
RUN apt -y install sudo curl dirmngr apt-transport-https lsb-release ca-certificates
RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
RUN sudo apt -y install nodejs
RUN npm install express
RUN npm install body-parser
# RUN apt-get -y install git
RUN apt-get install -y cron
RUN apt-get install -y vim

EXPOSE 8080 10000

COPY _entrypoint.sh /var/_entrypoint.sh
ENTRYPOINT cron start && cd /var && sh _entrypoint.sh
