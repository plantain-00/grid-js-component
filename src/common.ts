export type GridData = {
    rows: GridRowData[];
};

export type GridRowData = {
    cells: GridCellData[];
};

export type GridCellData = {
    value: any;
    component?: string;
};
