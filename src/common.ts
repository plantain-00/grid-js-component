export type GridData = {
    headers: GridRowData;
    rows: GridRowData[];
};

export type GridRowData = {
    cells: GridCellData[];
    style?: string;
};

export type GridCellData = {
    value: any;
    component?: string | React.ComponentClass<{ data: any }>;
    style?: string;
};

import * as Ps from "perfect-scrollbar";

export { Ps };
