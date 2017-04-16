export type GridData = {
    headers: GridRowData;
    rows: GridRowData[];
    leftHeaders?: GridRowData;
    leftRows?: GridRowData[];
    rightHeaders?: GridRowData;
    rightRows?: GridRowData[];
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

export function updateScroll(e: WheelEvent, container: HTMLElement) {
    const distance = e.wheelDelta > 0 ? 2 : (e.wheelDelta < 0 ? -2 : 0);
    container.scrollTop -= distance;
    Ps.update(container);
}

export function handleScrollEvent(e: Event, heads: HTMLElement, leftContainer: HTMLElement, rightContainer: HTMLElement) {
    /* tslint:disable:prefer-for-of */
    for (let i = 0; i < heads.childNodes.length; i++) {
        (heads.childNodes[i] as HTMLElement).style.left = -(e.target as HTMLElement).scrollLeft + "px";
    }
    for (let i = 0; i < leftContainer.childNodes.length; i++) {
        (leftContainer.childNodes[i] as HTMLElement).style.top = -(e.target as HTMLElement).scrollTop + "px";
    }
    for (let i = 0; i < rightContainer.childNodes.length; i++) {
        (rightContainer.childNodes[i] as HTMLElement).style.top = -(e.target as HTMLElement).scrollTop + "px";
    }
    /* tslint:enable:prefer-for-of */
}
