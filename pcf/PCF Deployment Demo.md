# Pivotal Cloud Foundry  

## Enterprise Application Deployment Transformed  

### Magenic Special Event: *Growing into the Cloud: A Developers Guide to Migration & Modernization*

### [Ramona Maxwell](https://ramonamaxwell.com)  

<!-- TOC depthFrom:4 orderedList:false -->

- [Introduction](#introduction)
- [Use Case](#use-case)
- [PCF Lab 411](#pcf-lab-411)
- [PCF Lab Activities](#pcf-lab-activities)

<!-- /TOC -->

#### Introduction  

Most modern application frameworks ease the task of deployment. The .Net Core framework, for instance, allows you to write once and then deploy to your choice of web or application server platforms. In a similar manner, JavaScript web applications can be distributed in a platform-neutral package. The key advantage to Pivotal Cloud Foundry is *to abstract the target platform.*  

Instead of assuming the burden of the endless minutiae of dev ops task to prepare each environment to not only host an application but also to scale, provide high availability, secure connections and more Pivotal Cloud Foundry can accomplish all these tasks. Development teams are free to focus on application logic instead of infrastructure.  

To compare the experience of using a deployment framework, one of the applications provided as a sample for this lab was first deployed manually to an Apache Server. It can be viewed at [SteelToeSolver.com](https://steeltoesolver.com).  

*Deploying on Apache required:*  

- Creating a service that defined the application and started an instance of Kestrel server.  
- Creating a batch job to start the service.  
- Creating a proxy from the Apache serve to the Kestrel server on its internal port.  
- Installing SSL certificates.  
- Creating the Apache configuration file.  

*Deploying on a PCF dev instance required:*  

- Executing the cf push command!  
    Steeltoesolver is a .Net Core app generated with the CLI and packaged as a self-contained deployment, and yet it required no special configuration to push to PCF (although some advantages of the PCF framework for .Net, such as Hystrix, are only utilized via Steeltoe, Pivotal's project to bring full .Net functionality to their platform).  

#### Use Case

- When organizations need rapid deployment of applications minus cloud administration tasks, then running a Pivotal instance will be justified.  
- Pivotal provides a [sizing tool](http://pcfsizer.pivotal.io/#!/sizing/vsphere/1.12/small) to assist with estimating capacity requirements on various platforms, including Azure.

#### PCF Lab 411

- Understanding PCF Hierarchy - Orgs and Spaces  
  - An [org](https://docs.pivotal.io/pivotalcf/2-0/concepts/roles.html#orgs) in PCF is a tenancy.  
  - Within a tenancy [spaces](https://docs.pivotal.io/pivotalcf/2-0/concepts/roles.html#spaces) can be created to organize deployments, such as creating spaces for dev, qa and prod.  
  - Users can be assigned [roles](https://docs.pivotal.io/pivotalcf/2-0/concepts/roles.html#spaces) to define their access within and org or space (RBAC).  
- [cf CLI Command Index](https://docs.pivotal.io/pivotalcf/2-0/cf-cli/cf-help.html) and some useful commands for this lab:  
  - [cf apps](http://cli.cloudfoundry.org/en-US/cf/apps.html) displays all apps present in a space.  
  - [cf app *appname*](http://cli.cloudfoundry.org/en-US/cf/app.html) displays information about a specific app.  
  - [cf push](http://cli.cloudfoundry.org/en-US/cf/push.html) deploys your application to the cloud with a single command.
  - [cf logs *appname*](http://cli.cloudfoundry.org/en-US/cf/logs.html) is equivalent to tailing logs in Linux.  
- What is a [Buildpack](https://docs.pivotal.io/pivotalcf/2-0/buildpacks/index.html)  
  - A Buildpack tells PCF everything it needs to know to host your application on a cloud platform. Core scripts in the Buildpack perform the following:  
    - *Detect* whether the Buildpack is a match to the app based on artifacts cf push places in the build directory.
    - *Supply* the app with needed dependencies once a match is verified.
    - *Finalize* prepares the app for launch.  
    - *Release* builds out the droplet directory for the app, and provides Cloud Foundry with information needed to launch.  
  - If you specify a Buildpack in the Application Manifest Detect will not run.
  - It is possible to have multiple Buildpacks for apps that cross platforms, but OOTB the relationship between Buildpack and app is one-to-one.

#### PCF Lab Activities

- Connect to wifi MSFTGUEST:
  - Event attendee Code: msevent06ib
- [Install the cf CLI](https://docs.pivotal.io/pivotalcf/2-0/cf-cli/install-go-cli.html)  
- Login to your org:  

  ````
  cf login -a https://api.sys.pcf-workshop.reboot3times.org
  ````
  
  Your username will be user$YOUR_NUMBER  
  Your password will be passwd$YOUR_NUMBER  
  For Example, if your user number is 19 your username is *user19* and your password is *passwd19*
  - This lab will remain active for about 48 hours
  - You can request a [trial subscription from Pivotal](http://run.pivotal.io/) to continue practicing PCF deployments.
  - Your lab has the following quotas attached:  
  Total Memory           3G  
  Instance Memory        1G  
  Routes                 1000  
  Services               4  
  Paid service plans     allowed  
  App instance limit     unlimited  
  Reserved Route Ports   0  

- Sample App
  - You can use any of the sample apps provided, or one of your own to test. Apps are available at the following repos:
    - [SteelToeSolver on GitHub - .Net Core](https://github.com/sqlsolver/steeltoesolver.git)  
    - [Sample Apps on Cloud Foundry](https://github.com/cloudfoundry-samples)  
- Prepare
  - [Service Instances](https://docs.pivotal.io/pivotalcf/2-0/devguide/services/managing-services.html)  
  - [Application Manifest](https://docs.pivotal.io/pivotalcf/2-0/devguide/deploy-apps/manifest.html)  
    - [Video - Application Manifest and Service Instance Example](https://youtu.be/p-OYycF7bPw)  
- Deploy  
  - [Routes and Domains](https://docs.pivotal.io/pivotalcf/2-0/devguide/deploy-apps/routes-domains.html) in PCF  
  - Pushing an application using [*cf push*](https://docs.pivotal.io/pivotalcf/2-0/cf-cli/getting-started.html#push)  
    - Route assignment for this lab will be randomly assigned by PCF, as the topic of routing is beyond the lab's scope. - Buildpack will be autodetected for today's lab.
    - Sample command if no Application Manifest:  
    
    ```
    cf push [app_name] -m 512M -k 512M --random-route
    ```

- Verify  
  - Browse to your application.
  - Run: cf logs [app_name] -recent  
  - [Video - Basic Logging with the CLI](https://youtu.be/PXLLqP2TOag)  
- Follow Up  
  - If you have time remaining try scaling your app, horizontally (number of instances), or vertically (resources allocated) using [*cf scale*](https://docs.pivotal.io/pivotalcf/2-0/devguide/deploy-apps/cf-scale.html)  
  - [Try PCF on Your Workstation](https://pivotal.io/platform/pcf-tutorials/getting-started-with-pivotal-cloud-foundry-dev/deploy-the-sample-app)  
  - [Get $87 credit on run.pivotal.io](https://run.pivotal.io/)  
  - [Contact Magenic](https://Magenic.com/contact)  