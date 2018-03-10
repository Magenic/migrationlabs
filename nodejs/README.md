# NodeJs and Mongo DB (in Cosmos) on Azure Kubernetes (K8s) Service (AKS) #

## Consider before you come ##

1. Consider making in advance
    * an AKS instance
    * a Image Repository instance
    * Consider making an CosmosDB (with a MongoDB API)
2. Look over the lab

## Node Lab Specific Tools ##

* NodeJS <https://nodejs.org/en/download/> use the LTS version
* Docker <https://www.docker.com/get-docker>
* Kubernetes Tools <https://kubernetes.io/docs/tasks/tools/install-kubectl/>
* *(optionally)* MongoDB Compass <https://www.mongodb.com/download-center#compass>

## Setup ##

1. Login to Azure Portal
2. Make an AKS instance *(See below)*
3. Make a Repository Instance *(See below)*
4. Make a CosmosDB instance with the MongoDB API *(See below)*
5. Start Up Docker Locally
6. Open a BASH shell (or the shell of you choice)  and do the logins and get configurations (see below)
    * Login to Azure
    * Login to Azure Repository
    * Download your K8s Credentials
7. Once you are up and ready, you can cd into the **Final** folder and do the lab *(see below)*

## Logging into Azure ##

```bash
az login
```
This will prompt you to open the following URL: `https:/aka.ms/devicelogin`
And then log you into Azure, and list your subscriptions

**Note:** If you have multiple subscriptions set the one your labs stuff is in explicitly to avoid misery

```bash
account set --subscription $sub
```
Where `$sub` is the GUID of your subscription of choice

## Logging into Your Repository ##

To login to your registry have your creds at hand and
```bash
winpty docker login $repo-url
```
where `$repo-url` is the URL of your repo from the Azure portal, you will be prompted for the user (by default the name of your repository instance), and the password.

## Download your K8s Credentials ##

To integrate your Azure Kubernetes details into your `kubectl` configuration you need only

```bash
aks get-credentials -n $kb -g $rg
```
where
* `$kb` is name of your cluster
* `$rg` is the name of the resource group it is in

You should get a message like this
```bash
Merged "$kb" as current context in C:\Users\{your-username}\.kube\config
```

## Making a Kuberetes Instance on Azure ##

Follow the steps in this video:

<a href="https://www.youtube.com/watch?v=OdigLuK09NE" target="_blank">https://www.youtube.com/watch?v=OdigLuK09NE</a>

## Making a Azure Container Repository ##

1. Go the marketplace and search for 'Container Repository'
2. Click add...
3. Give your repository a name and a resource group (not the same RG as your K8s instance is in) ideally in the same data-center as the other Azure resources you are making (use region 'West US' if possible)
4. Grab 3 values
    * Name: `{your registry name}`
    * URL: `{your registry name}.azurecr.io`
    * Password (from `Access Keys` page)

## Making a MongoDB instance using Cosmos DB ##

1. Go the marketplace and search for 'Azure Cosmos DB'
2. Click add...
3. Give your CosmosDB a name "peopledb-{yourname}" (you can set the name to anything that is unique and valid), and a resource group of "peoplerg" (use region 'West US' if possible)
4. Wait for it to create
5. Go to the 'collections' blade and 
    * make a DB called "DemoData2"
    * make a collection called "People"
6. Goto the connection string blade, and copy your connection string
7. Keep these 3 settings handy, you will need them later
 
# The Lab #

## What you will need from Azure ##

0. Your Azure Login Credentials

1. Your Cosmos DB Info
    * Connection String
    * DB
    * Collection

2. Your Kubernetes Info
    * Resource Group
    * Instance name

3. Your Repository Credentials
    * Name: `{your registry name}`
    * URL: `{your registry name}.azurecr.io` (or whatever it says)
    * Password (from `Access Keys` page)

## What does this program do? ##

This program uses NodeJS to host a REST API that exposes endpoints to
* Get a list of people
* Get one person given their ID (a GUID)

The program is written in NodeJS and uses libraries in the form of `NPM` packages to read/write from a MongoDB instance (hosted in CosmodDB), see `package.json` for the list.

The program was written by using a Swagger document, and generating then editing the resulting NodeJS source code.

This project leverages the mega-awesome [swagger-tools](https://github.com/apigee-127/swagger-tools) middleware which does most all the work.

See: https://www.youtube.com/watch?v=w71TrUUWRDU (for more details)

When the program starts, it connects to Mongo and if there are no records, it loads some, then consumers can use the API to query the people in the DB.

### Debugging the Swagger Middleware

```bash
DEBUG=swagger-tools:middleware:* node .
```

## Configuring the app and test it by running it locally ##

0. cd to the *final* folder (so we can see what it does)

1. Copy the file `example_settings.json` to `settings.json`
```bash
cp example_settings.json settings.json
```
2. Edit this file, and put your Mongo settings in
```json
{
    "ConnectionString" : "",
    "Database" : "",
    "Collection" : ""
}
```

3. Run the application locally

```bash
npm start
... npm install and build ...
Your server is listening on port 8080 (http://localhost:8080)
Swagger-ui is available on http://localhost:8080/docs
... your configuration info
```

4. Browse to `http://localhost:8080/docs` to see the swagger documentation and use it to call the API

5. Press *Control+C* to stop the app

## How to do the lab ##

1. cd to the `..\start` folder and open up the directory in your favorite tool.

2. Take a look at the project files

| File/Folder        | Description                       |
|--------------------|-----------------------------------|
| index.js           | program root                      |
| ./API/swagger.yaml | Generated swagger YAML            |
| ./controllers/     | Node JS API Controllers           |
| ./data/            | Seed data for Mongo               |
| ./services/        | Node JS Mongo Code                |
| package.json       | NPM File                          |
| settings.json      | Mongo settings file               |

3. The lab will have you making changes to the these files to
* Build a docker image
* Push it to your Azure Repository
* Make an K8s Deployment (of your docker image)
* Make that into an exposed service (hosted in K8s)

| File/Folder        | Description                       |
|--------------------|-----------------------------------|
| Dockerfile         | Docker Definition File            |
| aks-*.yaml         | Kubernetes deployment definitions |
| kubeit.sh          | Script to build/push to K8s       |

4. Then we'll use the `kubeit` bash script to use these files to deploy our app to K8s.

## Changing the `Dockerfile` ##

If you want your can change

```text
LABEL Author="Stuart Williams <stuartw@magenic.com>"
```
To be you...

## Changing the `aks-deployment.yaml` ##

Change the 

```text
image: {your registry url}/people-service
```
To be the setting you had above

## Changing the `aks-service.yaml` file

No changes are needed.

## Changing the `kubeit.sh` file ##

Change the
```text
REGISTRY={your registry url}
```
To be the setting you had above

## Run the `kubeit.sh` script ##

```bash
./kubeit.sh
```
The output is shortened for brevity...
```text
+ REGISTRY={your registry url}
+ IMAGE={your registry url}/people-service
+ npm i
up to date in 0.812s
+ docker build -t {your registry url}/people-service .
Sending build context to Docker daemon  19.79MB
Step 1/13 : FROM node:latest
 ---> d575940ea42b
Step 2/13 : LABEL ...
...
Step 3/13 : LABEL Version="1.4"
...
Step 4/13 : ENV PORT 8080
...
Step 5/13 : ENV WDIR /usr/src/peoplesvc
...
Step 6/13 : RUN mkdir -p ${WDIR}
...
Step 7/13 : WORKDIR ${WDIR}
...
Step 8/13 : COPY . .
...
Step 9/13 : RUN npm install
...
up to date in X.xxxs
...
Step 10/13 : RUN find ${WDIR} -type f  -follow -print | grep -v 
... list of files ...
Removing intermediate container ...
...
Step 11/13 : EXPOSE ${PORT}
 ---> Running in ...
Removing intermediate container ...
 ---> a8fcdac930d9
Step 12/13 : HEALTHCHECK --interval=5m --timeout=3s   CMD curl -f http://localhost:${PORT} || exit 1
 ---> Running in ...
Removing intermediate container ...
 ---> ...
Step 13/13 : CMD [ "npm", "start" ]
 ---> Running in ...
Removing intermediate container ...
 ---> ...
Successfully built ..
Successfully tagged {your registry url}/people-service:latest
...
+ docker push {your registry url}/people-service
The push refers to repository [{your registry url}/people-service]
...
+ kubectl create -f aks-deployment.yaml
deployment "people-service" created
+ kubectl create -f aks-service.yaml
service "people-service" created
```

## Testing your deployed service ##

1. See the list of deployments to make sure yours is ok
```bash
kubectl get deployments
```
Good output
```text
NAME             DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
people-service   1         1         1            1           1h
```

2. See the service to see yours is ok
```bash
kubectl get service people-service
```
Good Output
```text
NAME             TYPE           CLUSTER-IP     EXTERNAL-IP     PORT(S)          AGE
people-service   LoadBalancer   10.0.207.170   {external ip}   8080:30061/TCP   5m
```
> The external IP takes 3-5 minutes to be allocated

3. Browse to your web site once it has an extenal ip

```bash
start http://{external ip}:8080/docs
```

4. Play with the API

> Hint: call the 'PeopleList' API First to get an '_id' GUID to use to test the 'PeopleById' API

## Opening the K8s dashboard ##

K8s has a nice dashboard, you can open using this script

```bash
./kube-dashboard.sh
```