/// import * as Autodesk from "@types/forge-viewer";

import { SensorID, ChannelID, HistoricalDataView } from './HistoricalDataView.js';

/**
 * Base class for all Forge IoT extensions.
 *
 * Implements shared functionality such as toolbar UI initialization and handling of state changes.
 */
export abstract class BaseExtension extends Autodesk.Viewing.Extension {
    protected _dataView?: HistoricalDataView;
    protected _currentTime?: Date;
    protected _currentSensorID?: SensorID;
    protected _currentChannelID?: ChannelID;
    protected _dataVizExt: any; // TODO: update @types/forge-viewer

    constructor(viewer: Autodesk.Viewing.GuiViewer3D, options?: any) {
        super(viewer, options);
        this._dataView = undefined;
        this._currentTime = undefined;
        this._currentSensorID = undefined;
        this._currentChannelID = undefined;
        this._dataVizExt = null;
    }

    protected onDataViewChanged(oldDataView?: HistoricalDataView, newDataView?: HistoricalDataView) {}
    protected onCurrentTimeChanged(oldTime?: Date, newTime?: Date) {}
    protected onCurrentSensorChanged(oldSensorID?: SensorID, newSensorID?: SensorID) {}
    protected onCurrentChannelChanged(oldChannelID?: ChannelID, newChannelID?: ChannelID) {}

    protected getDefaultSensorID(): SensorID | undefined {
        if (!this._dataView) {
            return undefined;
        }
        return this._dataView.getSensors().keys().next().value;
    }

    protected getDefaultChannelID(): ChannelID | undefined {
        if (!this._dataView) {
            return undefined;
        }
        return this._dataView.getChannels().keys().next().value;
    }

    get dataView(): HistoricalDataView | undefined {
        return this._dataView;
    }

    set dataView(newDataView: HistoricalDataView | undefined) {
        const oldDataView = this._dataView;
        this._dataView = newDataView;
        this.onDataViewChanged(oldDataView, newDataView);
    }

    get currentTime(): Date {
        return this._currentTime || new Date();
    }

    set currentTime(newTime: Date | undefined) {
        const oldTime = this._currentTime;
        this._currentTime = newTime;
        this.onCurrentTimeChanged(oldTime, newTime);
    }

    get currentSensorID(): SensorID | undefined {
        return this._currentSensorID || this.getDefaultSensorID();
    }

    set currentSensorID(newSensorID: SensorID | undefined) {
        const oldSensorID = this._currentSensorID;
        this._currentSensorID = newSensorID;
        this.onCurrentSensorChanged(oldSensorID, newSensorID);
    }

    get currentChannelID(): ChannelID | undefined {
        return this._currentChannelID || this.getDefaultChannelID();
    }

    set currentChannelID(newChannelID: ChannelID | undefined) {
        const oldChannelID = this._currentChannelID;
        this._currentChannelID = newChannelID;
        this.onCurrentChannelChanged(oldChannelID, newChannelID);
    }

    async load(): Promise<boolean> {
        this._dataVizExt = await this.viewer.loadExtension('Autodesk.DataVisualization');
        return true;
    }

    unload(): boolean {
        this._dataVizExt = null;
        return true;
    }

    activate(): boolean {
        return true;
    }

    deactivate(): boolean {
        return true;
    }

    protected loadScript(url: string, namespace?: string): Promise<void> {
        for (const script of document.querySelectorAll('script').values()) {
            if (script.src === url) {
                return Promise.resolve();
            }
        }
        // @ts-ignore
        if (namespace && window[namespace] !== undefined) {
            console.warn('Script is already loaded but not from the requested URL', url);
        }
        return new Promise(function (resolve, reject) {
            const script = document.createElement('script');
            script.setAttribute('type', 'text/javascript');
            script.setAttribute('src', url);
            script.onload = () => resolve();
            script.onerror = (err) => reject(err);
            document.head.appendChild(script);
        });
    }

    protected loadStylesheet(url: string): Promise<void> {
        for (const link of document.querySelectorAll('link').values()) {
            if (link.href === url) {
                return Promise.resolve();
            }
        }
        return new Promise(function (resolve, reject) {
            const link = document.createElement('link');
            link.setAttribute('rel', 'stylesheet');
            link.setAttribute('type', 'text/css');
            link.setAttribute('href', url);
            link.onload = () => resolve();
            link.onerror = (err) => reject(err);
            document.head.appendChild(link);
        });
    }
}

export abstract class UIBaseExtension extends BaseExtension {
    protected _group?: Autodesk.Viewing.UI.ControlGroup;
    protected _button?: Autodesk.Viewing.UI.Button;

    constructor(viewer: Autodesk.Viewing.GuiViewer3D, options?: any) {
        super(viewer, options);
        this._group = undefined;
        this._button = undefined;
    }

    unload(): boolean {
        super.unload();
        this._removeToolbarUI();
        return true;
    }

    activate(): boolean {
        super.activate();
        this._button?.setState(Autodesk.Viewing.UI.Button.State.ACTIVE);
        (this as any).activeStatus = true; // TODO: update @types/forge-viewer
        return true;
    }

    deactivate(): boolean {
        super.deactivate();
        this._button?.setState(Autodesk.Viewing.UI.Button.State.INACTIVE);
        (this as any).activeStatus = false; // TODO: update @types/forge-viewer
        return true;
    }

    _createToolbarUI(buttonId: string, buttonTooltip: string, buttonIconUrl: string) {
        this._group = this.viewer.toolbar.getControl('iot-toolbar') as Autodesk.Viewing.UI.ControlGroup;
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('iot-toolbar');
            this.viewer.toolbar.addControl(this._group);
        }
        this._button = new Autodesk.Viewing.UI.Button(buttonId);
        this._button.onClick = (ev) => {
            this.setActive(!this.isActive(''), '');
        };
        const icon = (this._button as any).container.querySelector('.adsk-button-icon'); // TODO: update @types/forge-viewer
        if (icon) {
            icon.style.backgroundImage = `url(${buttonIconUrl})`; 
            icon.style.backgroundSize = `24px`; 
            icon.style.backgroundRepeat = `no-repeat`; 
            icon.style.backgroundPosition = `center`; 
            icon.style.filter = 'invert(1)';
        }
        this._button.setToolTip(buttonTooltip);
        this._group.addControl(this._button);
    }

    _removeToolbarUI() {
        if (this._group && this._button) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
            this._button = undefined;
            this._group = undefined;
        }
    }
}
