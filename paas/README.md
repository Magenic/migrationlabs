# Azure PaaS #

## PicShare Demo Application Overview ##

Within this folder you will find a solution for the demo application we will be working with.

    paas\PicShare_AzureDemo.sln

Go ahead and open that in your favorite IDE and ensure you can build and run the application.  You should see a basic photo sharing application that will allow you to upload an image and specify a caption.

*Note: The slideshow functionality has not been implemented and will not be used.*

Let's take a quick look at the code to understand what we are working with.

Under the `Controllers` folder you will see that we have `HomeController.cs` and `PicturesController.cs`.  `HomeController` is a basic controller to display the web view, so there is not much to see there.  `PicturesController` is a Web API controller that handles the logic for displaying and saving pictures.  Take a look through the code to understand what's going on.

You'll notice that this base version of the application stores images to the local file system and leverages a local SQL Server database.  In this lab, we'll move components of the application to Azure piece by piece to both get experience with the various offerings as well as see how doing this allows each component to scale as needed.

# Azure BLOB Storage #

## Setup Storage ##
1. Using the search bar at the top of the portal, search for "Storage" and select the result called "Storage accounts".  Note, do not select "Storage accounts (classic)".  This will take you to the storage service home screen.  
2. Click the '+' at the top of the page to add a new storage account and specify a name for your storage account.
3. Configure the storage options per the screenshots below

![](readme_images/BlobConfig1.png)
![](readme_images/BlobConfig2.png)

4. Click Create and Azure will spin up your new storage account
5. Once the account is created, you should be taken to the new account page.  If not, you can navigate back to it through "Storage accounts" and clicking on the name of your newly created account.
6. In the storage account navigation on the left, click Containers

![](readme_images/containers.png)

7. At the top of the page, click "+ Container" to create a new container.
8. Specify a name of your choosing and select "Blob..." for the public access level as shown below and click "OK"

![](readme_images/NewContainer.png)

Congratulations, you have successfully setup a storage account and container for our site images.  Next, let's update our app to take advantage of it!

## Update Image Storage in the Application ##

1. While still in the Azure portal storage area, click on the "Access keys" menu option on the left.
2. Copy the connection string for one of the keys displayed.
3. With the solution open in Visual Studio, open `appsettings.json`
4. Add the following configuration area to store settings for our Azure services:
```json
    "AzureConfig": {
        "StorageConnectionString": "",
	    "BlobContainer": ""
	}
```
5. Paste the connection string that you copied to the empty `StorageConnectionString` value
6. Enter the container name that you specified as the value for `BlobContainer` ("images" in the example screen shot above)
7. We will create a class to mirror the configuration information we just added so it can be injected into our code. In Solution Explorer, add a new class called `AzureConfig` to the Models folder.
8. Add `string` properties to the class to mirror the appsettings we added earlier.  Your code should look like this:

	public class AzureConfig
	{
		public string StorageConnectionString { get; set; }
        public string BlobContainer { get; set; }
	}

9. Open `startup.cs` and add the following line to `ConfigureServices` method to populate our new class with the values in appsettings.  **Tip:** You can use 'Ctrl' + '.' to bring in the `AzureConfig` namespace.
	services.Configure<AzureConfig>(Configuration.GetSection("AzureConfig"));
10. We need to add NuGet packages in order to work with Azure Storage.  Right-click on the project and select "Manage NuGet Packages..."
11. Search for "azure storage" and install the result shown below

![](readme_images/StorageNuGet.png)

12. Open `PicturesController` from the `Controllers` folder.
13. Add 2 new field to the class, one to store the configuration information and the other to provide a reference to your container.
	private readonly AzureConfig _azureConfig;
	private readonly CloudBlobContainer _imageContainer;
14. Update the constructor to use `IOptions<T>` to inject the configuration to the controller.  You can then use the configuration to setup your storage client and create a reference to your container.
	 public PicturesController(PicShareContext context, IHostingEnvironment environment, IOptions<AzureConfig> configOption)
        {
            _context = context;
            _env = environment;
            _azureConfig = configOption.Value;

            var account = CloudStorageAccount.Parse(_azureConfig.StorageConnectionString);
            var blobClient = account.CreateCloudBlobClient();
            _imageContainer = blobClient.GetContainerReference(_azureConfig.BlobContainer);
        }
15. Find the `GetFilePath` method.  Since we will no longer need the full path right-click and select the option to Rename the method to `GetFileName`.  Update the implementation to match the following:
	private string GetFileName(string localFilename)
        {
            // create the filename
            var tempName = Path.GetRandomFileName();
            var name = tempName.Substring(0, tempName.IndexOf('.')) +
                Path.GetExtension(localFilename);
            return name;
        }
16. Next, find and update the `SaveImage` method to store the upload image to our blob container.
	private async Task<string> SaveImage(IFormFile file)
        {
            var name = GetFileName(file.FileName);
            var link = string.Empty;
            if (file.Length > 0)
            {
                CloudBlockBlob blob = _imageContainer.GetBlockBlobReference(name);
                await blob.UploadFromStreamAsync(file.OpenReadStream());
                link = blob.Uri.ToString();
            }
            return link;
        }
17. `PostPicture` can now use just the returned URI to the image instead of specifying the local file path.
	public async Task<IActionResult> PostPicture(IFormFile image, string caption)
        {
            var link = await SaveImage(image);
            var picture = new Picture
            {
                AddedDate = DateTimeOffset.Now,
                Caption = caption,
                FilePath = link
            };

            _context.Picture.Add(picture);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPicture", new { id = picture.PictureId }, picture);
        }
18. Build and run your app.  Previously stored images should still appear, but if you upload a new image it will be saved to your new container.  After uploading, click into your container in the Azure portal to confirm that the new blobs are being saved.

Congratulations!  You are now one step closer to a fully cloud-native solution and have eliminated local storage, the biggest barrier to scaling out this solution.


# Azure SQL

Next, let's eliminate the need to patch and manage our SQL Server by migrating to Azure SQL.

## Creating the Database

1. From your Azure Portal, click to create a new resource in the top left.
![](readme_images/AddResource.png)
2. Select Databases, then SQL Database
![](readme_images/CreateDatabase.png)
3. Give your database a name, choose the subscription, and add it to the Resource Group you created for the blob store.  Create a new server if needed and select a Basic pricing tier.  Then click Create.
![](readme_images/DBConfig.png)
4. Once the database creation is complete, click into it to view details.  
5. At the top of the page, click Set server firewall
6. Click "Add client IP" to add your current IP to the firewall and click Save
7. Close that panel to return to the Overview.
8. Find the link to view the connection string, select the ADO.NET version and copy it for use in the application.

## Updating the App ##
1. Within `appsettings.json` replace the connection string value with the Azure SQL connection string you copied.  Remember to update the username and password.
2. Within Package Manager Console, run `Update-Database`
3. Build and run the application.  Upload a new image.

## Verify Azure SQL Usage ##
1. Back in the Azure portal, click "Query editor (preview)" in the left navigation, then select "Edit Data (Preview)" in the top navigation.  You should see a row for the upload you just made.


# Leverage App Service #
For the final step, we'll move the site itself into App Services to provide managed and scalable hosting.

## Create the App Service ##
1. In the portal, go to App Services
2. Click the '+ Add' button to create a new instance
3. Select a web app in the next panel and click Create
4. You'll be prompted to fill in some basic details, remember to choose your existing resource group
5. Click into the App Service Plan to configure the details. Set the pricing plan to B1 Basic plan and click Ok.
6. Click Create to generate your new App Service site.
7. Once your new service is created, click into it to view the details.
8. Download the publish profile so you can deploy your app.
![](readme_images/PublishProfile.png)

## Deploy the App ##
1. Back in the Visual Studio solution, select Build - Publish...
2. Click the link to create a new profile
3. Select Import and browse to the publish profile you downloaded
4. Before publishing, click Settings to view the publish configuration and click validate connection to ensure everything is working
![](readme_images/validateConnection.png)
5. Click Next and under Databases, check the box to use the connection string configured in App Settings.
5. Click Save
6. Click Publish to push your site to Azure

## Validate Deployment ##
1. Back in the Azure portal, still in the details for your App Service, click on the URL to open your live site.  You should see the existing images that you uploaded previously.  Upload another image to verify everything works.
2. Back in the portal, scroll down in the left App Service navigation and under Settings you'll notice your scaling options.
![](readme_images/scale.png)
3. Scale up will allow you to change the plan to a larger instance
4. Scale out will allow you to spin up additional instances
5. If you change to a higher level plan (standard or higher) you can configure Autoscale to dynamically adjust the number of instances to meet demands!

# Clean Up #
Let's make sure we clean up these resources so you have more free credits to experiment with and see how convenient resource groups make it to delete multiple items when you are done with them!
1. In the Azure portal, click Resource Groups in the left navigation
2. Find the resource group name you set up and click the '...' to expand the submenu
3. Select to delete the resource group (or leave it if you'd like to continue experimenting with it).  You'll be prompted to confirm by typing the name of your resource group.
4. Save money!
