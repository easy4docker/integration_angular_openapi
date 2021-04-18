FROM ubuntu:18.04

RUN apt update && apt autoremove
RUN apt -y install sudo curl dirmngr apt-transport-https lsb-release ca-certificates
RUN curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
RUN sudo apt -y install nodejs
RUN npm install -g @angular/cli

EXPOSE 4200

COPY _entrypoint.sh /var/_entrypoint.sh
ENTRYPOINT cd /var && sh _entrypoint.sh
