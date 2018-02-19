# NodeJs and Mongo DB on Azure #

## Before you come ##

1. Please sign up for an azure subscription (a free one is ok) <https://azure.microsoft.com/en-us/free/> 
2. Download and install the tools
3. Consider making an AKS instance in advance
4. Consider making an CosmosDB (with a MongoDB API)
5. Look over the lab

## Tools you will need ##

* GIT (for windows +BASH) <https://git-scm.com/downloads>
* Docker <https://www.docker.com/get-docker>
* NodeJS <https://nodejs.org/en/download/> use the LTS version
* Visual Studio or Visual Studio Code <https://code.visualstudio.com/download>
* Install Kubernetes Tools <https://kubernetes.io/docs/tasks/tools/install-kubectl/>

## Lab Organization ##

There are two folders
* Start (containing a partially completed project)
* Final (containing the finished project you can test)

## What you will need from Azure ##

1. Your Cosmos DB Info (see below)
2. Your Kubernetes Credentials

# Lab Steps #

1. Login to Azure
2. Make an AKS instance (See below)
3. Make a CosmosDB instance with the MongoDB API (See below)
4. Start up Docker Locally
5. Open a BASH shell (or the shell of you choice) 
6 Connect to your Kubernetes Cluster
7. 


## Making a Kuberetes Instance on Azure ##

Follow the steps in this video:

<a href="https://www.youtube.com/watch?v=OdigLuK09NE" target="_blank">https://www.youtube.com/watch?v=OdigLuK09NE</a>

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