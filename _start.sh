#!/bin/bash

EDITOR_PORT=9000
API_PORT=8000
DOCKERCMD=$(command -v docker)
SCR_DIR=$(cd `dirname $0` && pwd)
TOP_DIR=$(dirname "${SCR_DIR}")
DATA_DIR=${TOP_DIR}/data
LOG_PATH=${TOP_DIR}/log
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

echo ${SCR_DIR}/swagger_editor
cd ${SCR_DIR}/swagger_editor

# docker build -f ${TOP_DIR}/swagger_editor/Dockerfile -t local-swagger-editor .

docker stop swagger-editor-container
docker rm swagger-editor-container
# docker image rm local-swagger-editor
# docker build -t local-swagger-editor .

docker run -d -p ${EDITOR_PORT}:8080 -v ${DATA_DIR}:/tmp -e SWAGGER_FILE=/tmp/3.0.1.YAML --name swagger-editor-container local-swagger-editor

cd ${SCR_DIR}/api_server
docker stop api-container
docker rm api-container
# docker image rm api-image

# docker build -f ${SCR_DIR}/Dockerfile -t api-image .
docker run -d -p ${API_PORT}:8080 -p 10000:10000 -v ${SCR_DIR}/api_server:/var/app -v ${DATA_DIR}:/var/appData --name api-container api-image

#--- Main common cron loop ---
stsCron=1
until [ $stsCron = 0 ]
do 
    if [ $stsCron != 0 ] ; then
        sh ${SCR_DIR}/_commCron.sh &
    fi
    sleep 1
done
