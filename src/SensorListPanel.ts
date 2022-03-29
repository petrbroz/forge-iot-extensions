/// import * as Autodesk from "@types/forge-viewer";

import { findNearestTimestampIndex, HistoricalDataView, SensorID } from './HistoricalDataView.js';

export class SensorListPanel extends Autodesk.Viewing.UI.PropertyPanel {
    public onSensorClicked?: (sensor: SensorID) => void;
    protected table?: Tabulator;

    constructor(viewer: Autodesk.Viewing.GuiViewer3D, id: string, title: string, options?: any) {
        super(viewer.container, id, title, options);
        this.container.style.left = (options.x || 0) + 'px';
        this.container.style.top = (options.y || 0) + 'px';
        this.container.style.width = (options.width || 500) + 'px';
        this.container.style.height = (options.height || 400) + 'px';
        this.container.style.resize = 'none';
    }

    initialize() {
        this.title = this.createTitleBar(this.titleLabel || this.container.id);
        this.initializeMoveHandlers(this.title);
        this.container.appendChild(this.title);
        this.content = document.createElement('div');
        this.content.style.height = '350px';
        this.content.style.backgroundColor = 'white';
        this.content.innerHTML = `<div class="datagrid-container" style="position: relative; height: 350px;"></div>`;
        this.container.appendChild(this.content);
        this.table = new Tabulator('.datagrid-container', {
            height: '100%',
            layout: 'fitColumns',
            groupBy: 'group',
            columns: [
                // { title: 'ID', field: 'dbid' },
                // { title: 'Name', field: 'name', width: 150 },
                // { title: 'Volume', field: 'volume', hozAlign: 'left', formatter: 'progress' },
                // { title: 'Material', field: 'material' }
            ]
        });
        this.table.on('rowClick', (ev: any, row: any) => {
            if (this.onSensorClicked) {
                const data = row.getData();
                this.onSensorClicked(data.id);
            }
        });
    }

    update(dataView: HistoricalDataView, timestamp: Date, updateColumns: boolean) {
        if (updateColumns) {
            const columns = [
                { title: 'Sensor', field: 'sensor' },
                { title: 'Group', field: 'group' }
            ];
            for (const [channelId, channel] of dataView.channels.entries()) {
                columns.push({ title: channel.name, field: channelId });
            }
            this.table?.setColumns(columns);
        }
        const rows = [];
        for (const [sensorId, sensor] of dataView.sensors.entries()) {
            const row: { [key: string]: any } = {
                id: sensorId,
                sensor: sensor.name,
                group: sensor.groupName
            };
            for (const [channelId, channel] of dataView.channels.entries()) {
                const samples = dataView.getSamples(sensorId, channelId);
                if (samples) {
                    const closestIndex = findNearestTimestampIndex(samples.timestamps, timestamp); // TODO: reuse this code from BaseExtension
                    row[channelId] = `${samples.values[closestIndex].toFixed(2)} ${channel.unit}`;
                }
            }
            rows.push(row);
        }
        this.table?.replaceData(rows);
    }
}
