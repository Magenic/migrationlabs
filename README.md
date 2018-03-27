# Migration Labs #
A series of hands on labs around migration and modernization

This repository contains:

* A PowerPoint Introduction To Migration and Modernization
    * [PPTX] <a href="Migration-Modernization.pdf" target="_blank">PowerPoint Format</a>
    * [PDF] <a href="Migration-Modernization.pdf" target="_blank">PDF Format</a>
* A series of lab folders each containing one or more projects you can modernize and migrate
    * <a href="paas\README.md" target="_blank">Azure PaaS</a>
    * <a href="nodejs\README.md" target="_blank">Azure Kubernetes</a>
    * <a href="pcf\README.md" target="_blank">Azure PCF</a>

## Prerequisites ##

1. An Azure Account, if you don't have one, sign up for free: <a href="https://azure.microsoft.com/en-us/free/" target="_blank">Sign up for Azure</a>
2. GIT (source control client) for your O/S <a href="https://git-scm.com/downloads" target="_blank">Download GIT</a>
3. Azure CLI <https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-windows?view=azure-cli-latest>
* See notes below...
4. Your favorite editor for Code. 
* Visual Studio Code is free: <https://code.visualstudio.com/download>

### Azure CLI in BASH on Windows Notes ###

Unfortunately, **BASH** on Windows hates paths with spaces and parenthesis, so the CLI location of 
```DOS
C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2
```
Is terrible. Here is what I do, I copy the 'Azure' folder and all sub-folders to my `C:\` drive (root) e.g.

```DOS
C:\CLI2\
```

And then from BASH when ever I need to execute an Azure command instead of the command you would execute from DOS/Visual-Studio-Command-Line
```DOS
AZ.cmd {arguments}
```
We would use this
```bash
/C/CLI2/python.exe -Im azure.cli {arguments}
```
Or better yet, make an alias so you have it anytime
```bash
alias az='/C/CLI2/python.exe -Im azure.cli $*'
```
Which you could put in your `~/.bashrc`

> In this document we will assume you have done this and that `az` will do the right thing on your machine


## Magenic ##
This <a href="MagenicOverview.pdf">PDF</a> will give you an overview of Magenic and how we can help you get your digital products to market faster.

## Authors ##

* Stuart Williams
    * <stuartw@magenic.com>
    * Cloud Practice Lead, National
    * Blog: http://blitzkriegsoftware.net/Blog 
    * LinkedIn: http://lnkd.in/P35kVT 
    * YouTube: https://www.youtube.com/channel/UCO88zFRJMTrAZZbYzhvAlMg 

* Chris Plowman 
    * <ChrisP@magenic.com>
    * Client Solutions Manager, San Francisco, CA
    * Blog: https://chrispycode.ninja/
    * LinkedIn: https://www.linkedin.com/in/chrispy2day/
    * GitHub: https://github.com/chrispy2day

* Ramona Maxwell 
    * <RamonaM@magenic.com>
    * Lead Consultant, San Francisco, CA

