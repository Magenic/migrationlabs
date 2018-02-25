#!/bin/bash
set +x
echo browse to http://localhost:8001/api/v1/namespaces/kube-system/services/kubernetes-dashboard/proxy/ to see dashboard
kubectl proxy
