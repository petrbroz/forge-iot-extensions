# forge-iot-extensions

Set of [Autodesk Forge](https://forge.autodesk.com) viewer extensions built on top of
the [Data Visualization extensions](https://forge.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/),
allowing developers to easily visualize IoT data.

## Usage

- import the extensions index file (for example, https://unpkg.com/forge-iot-extensions@0.0.4/dist/index.js)
as an ES6 module into your viewer application
- add the desired extensions to your viewer configuration
    - currently available: `IoT.SensorList`, `IoT.SensorDetail`, `IoT.SensorSprites`, `IoT.SensorHeatmaps`
- implement your own "data view" based on the [HistoricalDataView](./src/HistoricalDataView.ts) interface
- control the state of the extensions through properties such as `dataView`, `currentTime`, `currentSensorID`, or `currentChannelID`

See the _docs/example.html_ file for an actual example of how the extensions are used.
You can test it locally by running a simple static server in the root folder of this
project (e.g., using Python: `python -m SimpleHTTPServer 8080`), and navigate to
[http://localhost:8080/docs/example.html]([http://localhost:8080/docs/example.html]) in the browser.
