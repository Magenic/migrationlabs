#!/bin/bash
set +x

REGISTRY={your registry url}

# Build the docker image
IMAGE=$REGISTRY/people-service

npm i
docker build -t $IMAGE .

retVal=$?
if [ ! $? -eq 0 ]; then
    exit $retVal
fi

docker push $IMAGE
retVal=$?
if [ ! $? -eq 0 ]; then
    exit $retVal
fi

# Push to K8s
kubectl create -f aks-deployment.yaml
kubectl create -f aks-service.yaml