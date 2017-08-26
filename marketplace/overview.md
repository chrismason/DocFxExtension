# Visual Studio Team Services Extension for DocFx
This extension contains a build task which allow you to use [DocFx](http://dotnet.github.io/docfx/) to build a static documentation site.

## Prerequisites
If you wish to manually control the version of DocFx, you can install DocFx on the agent by downloading the package from the site above and add **docfx.exe** to the system's path. If you are using a hosted build agent or wish to always grab the latest version of DocFx, this extension will grab the latest version from NuGet. This requires that the build agent has connection to [nuget](https://www.nuget.org) or is configured against a private NuGet repository that hosts the **docfx.console** package. See [Create DocFx Documentation](#create-docfx-documentation) below for additional information.

## Quick Start
1. Install the DocFx extension from the [VSTS Marketplace](https://marketplace.visualstudio.com/items?itemName=chrismason.vsts-docfxtasks)
2. Go to your Visual Studio Team Services or TFS project, click on the **Build** tab, and create a new build definition (the "+" icon) that is hooked up to your project's appropriate source repo
3. Click **Add build step..."** and select **Create DocFx Documentation** from the **Utility** category
4. Configure the **Create DocFx Documentation** to point to the location of your **docfx.json** file in your project
5. Click the **Queue Build** button or push a change to your repo in roder to run the newly defined build pipeline
6. Your DocFx project documentation will now be generated

## Task Reference
This extension contains the following build task:
* [Create DocFx Documentation](#create-docfx-documentation) - Run the DocFx toolset against a project to create documentation.

### Create DocFx Documentation
Allows you to download DocFx or use a preconfigured one to build documentation project. This task includes the following options:

1. **Project File** *(File path, required)* - The relative path to the **docfx.json** file needed to build your project.
2. **Use Custom Template** *(Boolean, option)* - Select this option if you want DocFx to use a custom template to format your site.
3. **Template Location** *(File path, required if using a custom template)* - The relative path to the folder containing your DocFx site template.

#### Advanced Options
1. **DocFx Options** *(String, optional)* - By default, the task builds with the following command:
    ```
    docfx path\to\docfx.json
    ```
    If you wish to change the way DocFx is called, use this field to override the defaults.
2. **NuGet Configuration File** *(String, optional)* - If you wish you change the behavior of NuGet based on a **NuGet.Config** file, use this value to provide a path to the config file on the build agent.
