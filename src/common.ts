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
    /* tslint:disable:ban-types */
    component?: string | Function;
    /* tslint:enable:ban-types */
    style?: string;
};

import * as Ps from "perfect-scrollbar";

export { Ps };
