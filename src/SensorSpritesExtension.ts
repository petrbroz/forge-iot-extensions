/// import * as Autodesk from "@types/forge-viewer";

import { UIBaseExtension } from './BaseExtension.js';
import { HistoricalDataView, SensorID } from './HistoricalDataView.js';

export const SensorSpritesExtensionID = 'IoT.SensorSprites';

export class SensorSpritesExtension extends UIBaseExtension {
    protected _style?: Autodesk.DataVisualization.Core.ViewableStyle;
    public onSensorClicked?: (sensor: SensorID) => void;
    protected _dbIdToSensorId: Map<number, SensorID>;

    constructor(viewer: Autodesk.Viewing.GuiViewer3D, options?: any) {
        super(viewer, options);
        this._onSpriteClicked = this._onSpriteClicked.bind(this);
        this._dbIdToSensorId = new Map();
        this.update = this.update.bind(this);
    }

    protected onDataViewChanged(oldDataView?: HistoricalDataView, newDataView?: HistoricalDataView) { this.update(); }

    protected update() {
        if ((this as any).isActive()) { // TODO: update @types/forge-viewer
            this._refreshSprites();
        }
    }

    async load(): Promise<boolean> {
        await super.load();
        this._style = this._createVisualStyle();
        this.viewer.addEventListener(Autodesk.DataVisualization.Core.MOUSE_CLICK, this._onSpriteClicked);
        console.log(`${SensorSpritesExtensionID} extension loaded.`);
        return true;
    }

    unload(): boolean {
        super.unload();
        this._style = undefined;
        this.viewer.removeEventListener(Autodesk.DataVisualization.Core.MOUSE_CLICK, this._onSpriteClicked);
        console.log(`${SensorSpritesExtensionID} extension unloaded.`);
        return true;
    }

    activate(): boolean {
        super.activate();
        this._refreshSprites();
        return true;
    }

    deactivate(): boolean {
        super.deactivate();
        this._dataVizExt.removeAllViewables();
        return true;
    }

    onToolbarCreated() {
        this._createToolbarUI('iot-sensor-sprites-btn', 'IoT Sensor Sprites', 'https://img.icons8.com/ios-filled/50/000000/iot-sensor.png'); // <a href="https://icons8.com/icon/61307/iot-sensor">IoT Sensor icon by Icons8</a>
    }

    _onSpriteClicked(ev: any) {
        if (this.onSensorClicked) {
            this.onSensorClicked(this._dbIdToSensorId.get(ev.dbId) as SensorID);
        }
    }

    _refreshSprites() {
        this._dataVizExt.removeAllViewables();
        if (!this.dataView) {
            return;
        }
        const viewableData = new Autodesk.DataVisualization.Core.ViewableData();
        viewableData.spriteSize = 32;
        this._dbIdToSensorId.clear();
        let dbid = 1000000;
        for (const [sensorId, sensor] of this.dataView.sensors.entries()) {
            this._dbIdToSensorId.set(dbid, sensorId);
            const { x, y, z } = sensor.location;
            const style = this._style as Autodesk.DataVisualization.Core.ViewableStyle;
            const viewable = new Autodesk.DataVisualization.Core.SpriteViewable(new THREE.Vector3(x, y, z), style, dbid++);
            viewableData.addViewable(viewable);
        }
        viewableData.finish().then(() => {
            this._dataVizExt.addViewables(viewableData);
        });
    }

    _createVisualStyle() {
        const DataVizCore = Autodesk.DataVisualization.Core;
        const viewableType = DataVizCore.ViewableType.SPRITE;
        const spriteColor = new THREE.Color(0xffffff);
        const spriteIconUrl = 'https://img.icons8.com/color/48/000000/electrical-sensor.png'; // <a href="https://icons8.com/icon/12096/proximity-sensor">Proximity Sensor icon by Icons8</a>
        return new DataVizCore.ViewableStyle(viewableType, spriteColor, spriteIconUrl);
    }
}
