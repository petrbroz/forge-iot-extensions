declare class Tabulator {
    constructor(selector: string, options: any);
    on(eventName: string, callback: (ev: any, row: any) => void);
    setColumns(columns: any[]);
    replaceData(rows: any[]);
}
