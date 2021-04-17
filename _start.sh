#!/bin/bash

ESITOR_PORT=9000
DOCKERCMD=$(command -v docker)
SCR_DIR=$(cd `dirname $0` && pwd)
DATA_DIR=${SCR_DIR}/data
LOG_PATH=${DATA_DIR}/log
MAIN_NET="10.10.10"
MAIN_IP="10.10.10.254"

# ---- prepare S -----
OSENV=""
case "$(uname -s)" in
   Darwin)
     OSENV='Mac'
     ;;
   Linux)
     OSENV='Linux'
     ;;

   CYGWIN*|MINGW32*|MSYS*|MINGW*)
     OSENV='MS Windows'
     ;;
   *)
     OSENV='' 
     ;;
esac

if  [ "$DOCKERCMD" = "" ]; then
    echo "\nDocker should be installed!" >> ${LOG_PATH}/easyDockerLog.data
    exit 1
fi

mkdir -p ${LOG_PATH}
NETWORK_NAME=network_easydocker
if [ -z $(docker network ls --filter name=^${NETWORK_NAME}$ --format="{{ .Name }}") ] ; then 
    docker network create \
        --driver=bridge \
        --subnet=${MAIN_NET}.0/16 \
        --ip-range=${MAIN_NET}.0/24 \
        --gateway=${MAIN_IP} \
       network_easydocker &> /dev/null
fi

docker stop $(docker ps -a -q)
docker rm $(docker ps -a -q)

if [ $OSENV = "Mac" ]; then
    echo "localhost" > ${SCR_DIR}/data/_ip
fi


echo "{\"main_ip\": \"${MAIN_IP}\", \"host_ip\": \"$(cat ${SCR_DIR}/data/_ip)\", \"env\": \"$1\", \"app_root\": \"${SCR_DIR}\", \"code_folder\": \"$PWD\", \"data_folder\": \"$DATA_DIR\"}" > "$DATA_DIR"/_env.json

docker stop swagger-editor-container
docker rm swagger-editor-container

docker run -d -p ${ESITOR_PORT}:8080 -v $(pwd):/tmp -e SWAGGER_FILE=/tmp/swagger.json --name swagger-editor-container swaggerapi/swagger-editor

#--- Main common cron loop ---
stsCron=1
until [ $stsCron = 0 ]
do 
    if [ $stsCron != 0 ] ; then
        sh ${SCR_DIR}/_commCron.sh &
    fi
    sleep 1
done
