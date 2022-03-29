export type SensorID = string;
export type ChannelID = string;
export type ChannelDataType = 'double';

/**
 * IoT sensor description.
 */
export interface Sensor {
    /** Sensor display name. */
    name: string;
    /** Optional sensor description. */
    description?: string;
    /** Optional group the sensor belongs to. */
    groupName?: string;
    /** Sensor location. */
    location: { x: number, y: number, z: number };
    /** Optional ID of object to be shaded with heatmaps. */
    objectId?: number;
}

/**
 * IoT sensor channel.
 */
export interface Channel {
    /** Sensor channel display name. */
    name: string;
    /** Sensor channel description. */
    description?: string;
    /** Sensor channel data type. */
    type: ChannelDataType;
    /** Sensor channel data unit. */
    unit: string;
    /** Sensor channel minimum data value. */
    min: number;
    /** Sensor channel maximum data value. */
    max: number;
}

/**
 * Collection of historical data of single sensors.
 */
export interface Samples {
    /** Number of data samples. */
    count: number;
    /** Timestamps for individual data samples. */
    timestamps: Date[];
    /** Data sample values. */
    values: number[];
}

/**
 * Contains subset of historical IoT data for specific sensors,
 * sensor channels, and timerange.
 */
export interface HistoricalDataView {
    sensors: Readonly<Map<SensorID, Sensor>>;
    channels: Readonly<Map<ChannelID, Channel>>;
    getSamples(sensorId: SensorID, channelId: ChannelID): Readonly<Samples> | undefined;
}

export function findNearestTimestampIndex(list: Date[], timestamp: Date, fractional: boolean = false): number {
    let start = 0;
    let end = list.length - 1;
    if (timestamp <= list[0]) {
        return 0;
    }
    if (timestamp >= list[end]) {
        return end;
    }
    while (end - start > 1) {
        let currentIndex = start + Math.floor(0.5 * (end - start));
        if (timestamp < list[currentIndex]) {
            end = currentIndex;
        } else {
            start = currentIndex;
        }
    }
    if (fractional && start < end) {
        // @ts-ignore
        return start + (timestamp - list[start]) / (list[end] - list[start]);
    } else {
        // @ts-ignore
        return (timestamp - list[start] < list[end] - timestamp) ? start : end;
    }
}
