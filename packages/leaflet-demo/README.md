Demo: @wsdot/arcgis-rest-lrs
============================

Interactive map application that demonstrates abilities of the [@wsdot/arcgis-rest-lrs] library.

The application is hosted at <https://wsdot-gis.github.io/arcgis-rest-lrs/>.

Build instructions
------------------

1. Clone this repository to your computer
2. Open the cloned repository folder in your computer's shell / console.
3. Type `npm install`. This will install all dependencies and then build the application. For subsequent builds, you can use `npm run prepare`, which will just perform the build without checking the dependencies.
4. Run a web server to serve the directory as a website. You can use the [IIS Express executer] extension in Visual Studio Code to accomplish this.

Publish to GitHub Pages
-----------------------

The following command will update the site at <https://wsdot-gis.github.io/arcgis-rest-lrs/>.

```shell
npm run publish
```

[@wsdot/arcgis-rest-lrs]: https://github.com/WSDOT-GIS/arcgis-rest-lrs
[iis express executer]: https://marketplace.visualstudio.com/items?itemName=Andreabbondanza.iis-express-executer
