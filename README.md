# forge-iot-extensions

Set of [Autodesk Forge](https://forge.autodesk.com) viewer extensions built on top of
the [Data Visualization extensions](https://forge.autodesk.com/en/docs/dataviz/v1/developers_guide/introduction/overview/),
allowing developers to easily visualize IoT data.

## Usage

- import the extensions index file (an ES6 module) into your HTML:

```html
<script type="module" src="https://unpkg.com/forge-iot-extensions@latest/dist/index.js"></script>
```

- add the desired extensions to your viewer configuration:

```js
const config = {
    extensions: ['IoT.SensorList', 'IoT.SensorDetail', 'IoT.SensorSprites', 'IoT.SensorHeatmaps']
};
const viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('preview'), config);
```

- implement your own "data view" based on the [HistoricalDataView](./src/HistoricalDataView.ts) interface, for example:

```js
class MyDataView {
    constructor() {
        this._sensors = new Map();
        this._sensors.set('sensor1', { name: 'Kitchen', description: '...', groupName: 'Level 1', location: { x: 10, y: 41.64, z: -12.15 }, objectId: 4111 });
        this._sensors.set('sensor2', { name: 'Living Room', description: '...', groupName: 'Level 1', location: { x: 31.92, y: 11.49, z: -12.97 }, objectId: 4124 });
        this._channels = new Map();
        this._channels.set('temp', { name: 'Temperature', description: 'External temperature in degrees Celsius.', type: 'double', unit: '°C', min: 18.0, max: 28.0 });
        this._samples = new Map();
    }

    getSensors() {
        return this._sensors;
    }

    getChannels() {
        return this._channels;
    }

    getSamples(sensorId, channelId) {
        const cacheKey = `${sensorId}:${channelId}`;
        if (!this._samples.has(cacheKey)) {
            const samples = { count: 32, timestamps: [], values: [] };
            for (let i = 0; i < samples.count; i++) {
                samples.timestamps.push(new Date(2022, 0, 1, 8 + i));
                samples.values.push(18.0 + Math.random() * 10);
            }
            this._samples.set(cacheKey, samples);
        }
        return this._samples.get(cacheKey);
    }
}
```

- control the state of the extensions through their properties such as `dataView`, `currentTime`,
`currentSensorID`, or `currentChannelID`:

```js
const myDataView = new MyDataView();
for (const extensionId of ['IoT.SensorList', 'IoT.SensorDetail', 'IoT.SensorSprites', 'IoT.SensorHeatmaps']) {
    const ext = viewer.getExtension(extensionId);
    ext.dataView = myDataView;
    ext.currentTime = new Date(2022, 0, 1, 12);
    ext.currentSensorID = 'sensor1';
    ext.currentChannelID = 'temp';
}
```
