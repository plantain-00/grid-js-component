export type GridData = {
    headers: GridRowData;
    rows: GridRowData[];
};

export type GridRowData = {
    cells: GridCellData[];
};

export type GridCellData = {
    value: any;
    component?: string;
    style?: string;
};

import * as Ps from "perfect-scrollbar";

export { Ps };
