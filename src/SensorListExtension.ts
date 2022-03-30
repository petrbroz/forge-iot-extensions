/// import * as Autodesk from "@types/forge-viewer";

import { UIBaseExtension } from './BaseExtension.js';
import { HistoricalDataView, SensorID } from './HistoricalDataView.js';
import { SensorListPanel } from './SensorListPanel.js';

export const SensorListExtensionID = 'IoT.SensorList';

export class SensorListExtension extends UIBaseExtension {
    public panel?: SensorListPanel;
    public onSensorClicked?: (sensor: SensorID) => void;

    constructor(viewer: Autodesk.Viewing.GuiViewer3D, options?: any) {
        super(viewer, options);
    }

    override onDataViewChanged(oldDataView?: HistoricalDataView, newDataView?: HistoricalDataView) { this.update(true); }
    override onCurrentTimeChanged(oldTime?: Date, newTime?: Date) { this.update(false); }

    protected update(updateColumns: boolean) {
        if (this.dataView && this.currentTime && this.panel) {
            this.panel.update(this.dataView, this.currentTime, updateColumns);
        }
    }

    async load(): Promise<boolean> {
        await super.load();
        await Promise.all([
            // this.loadScript('https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js', 'moment'), // is this needed?
            this.loadScript('https://unpkg.com/tabulator-tables@5.1.7/dist/js/tabulator.min.js', 'Tabulator'),
            this.loadStylesheet('https://unpkg.com/tabulator-tables@5.1.7/dist/css/tabulator_midnight.min.css')
        ]);
        this.panel = new SensorListPanel(this.viewer, 'iot-sensor-list', 'Sensors', {});
        this.panel.onSensorClicked = (sensorId: SensorID) => {
            if (this.onSensorClicked) {
                this.onSensorClicked(sensorId);
            }
        };
        console.log(`${SensorListExtensionID} extension loaded.`);
        return true;
    }

    unload(): boolean {
        super.unload();
        this.panel?.uninitialize();
        this.panel = undefined;
        console.log(`${SensorListExtensionID} extension unloaded.`);
        return true;
    }

    activate(): boolean {
        super.activate();
        this.panel?.setVisible(true);
        return true;
    }

    deactivate(): boolean {
        super.deactivate();
        this.panel?.setVisible(false);
        return true;
    }

    onToolbarCreated() {
        this.createToolbarButton('iot-sensor-list-btn', 'IoT Sensor list', 'https://img.icons8.com/ios-filled/50/000000/reminders.png'); // <a href="https://icons8.com/icon/qTpBZcesrDao/reminders">Reminders icon by Icons8</a>
    }
}
