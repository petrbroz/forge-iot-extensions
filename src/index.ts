/// import * as Autodesk from "@types/forge-viewer";

import { SensorListExtension, SensorListExtensionID } from './SensorListExtension.js';
import { SensorDetailExtension, SensorDetailExtensionID } from './SensorDetailExtension.js';
import { SensorSpritesExtension, SensorSpritesExtensionID } from './SensorSpritesExtension.js';
import { SensorHeatmapsExtension, SensorHeatmapsExtensionID } from './SensorHeatmapsExtension.js';

export { HistoricalDataView, SensorID, Sensor, ChannelID, Channel } from './HistoricalDataView.js';
export { SensorListExtension, SensorDetailExtension, SensorSpritesExtension, SensorHeatmapsExtension };
export const AllExtensionIDs = [
    SensorListExtensionID,
    SensorDetailExtensionID,
    SensorSpritesExtensionID,
    SensorHeatmapsExtensionID
];

Autodesk.Viewing.theExtensionManager.registerExtension(SensorListExtensionID, SensorListExtension);
Autodesk.Viewing.theExtensionManager.registerExtension(SensorDetailExtensionID, SensorDetailExtension);
Autodesk.Viewing.theExtensionManager.registerExtension(SensorSpritesExtensionID, SensorSpritesExtension);
Autodesk.Viewing.theExtensionManager.registerExtension(SensorHeatmapsExtensionID, SensorHeatmapsExtension);
