export type GridData = {
    headers: GridRowData;
    rows: GridRowData[];
    leftHeaders?: GridRowData;
    leftRows?: GridRowData[];
    rightHeaders?: GridRowData;
    rightRows?: GridRowData[];
    sortColumn?: string;
    sortType?: "asc" | "desc";
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

export type SortData = {
    cell: GridCellData;
    header: GridRowData;
    columnIndex: number;
};

export type ClickData = {
    cell: GridCellData;
    row: GridRowData;
    body: GridRowData[];
    rowIndex: number;
    columnIndex: number;
};

export type ActionData = {
    data: any;
} & (SortData | ClickData);

import * as Ps from "perfect-scrollbar";

export { Ps };

function getDeltaFromEvent(e: WheelEvent) {
    let deltaX = e.deltaX;
    let deltaY = -1 * e.deltaY;

    if (typeof deltaX === "undefined" || typeof deltaY === "undefined") {
        // OS X Safari
        deltaX = -1 * e.wheelDeltaX / 6;
        deltaY = e.wheelDeltaY / 6;
    }

    if (e.deltaMode && e.deltaMode === 1) {
        // Firefox in deltaMode 1: Line scrolling
        deltaX *= 10;
        deltaY *= 10;
    }

    if (isNaN(deltaX) && isNaN(deltaY)) {
        // IE in some mouse drivers
        deltaX = 0;
        deltaY = e.wheelDelta;
    }

    if (e.shiftKey) {
        // reverse axis with shift key
        return { deltaX: -deltaY, deltaY: -deltaX };
    }
    return { deltaX, deltaY };
}

export function updateVerticalScroll(e: WheelEvent, container: HTMLElement) {
    const { deltaY } = getDeltaFromEvent(e);
    container.scrollTop -= deltaY;
    Ps.update(container);
}

export function updateHorizontalScroll(e: WheelEvent, container: HTMLElement) {
    const { deltaX } = getDeltaFromEvent(e);
    container.scrollLeft += deltaX;
    Ps.update(container);
}

export function handleScrollYEvent(e: Event, leftContainer: HTMLElement | undefined, rightContainer: HTMLElement | undefined) {
    /* tslint:disable:prefer-for-of */
    if (leftContainer) {
        for (let i = 0; i < leftContainer.childNodes.length; i++) {
            (leftContainer.childNodes[i] as HTMLElement).style.top = -(e.target as HTMLElement).scrollTop + "px";
        }
    }
    if (rightContainer) {
        for (let i = 0; i < rightContainer.childNodes.length; i++) {
            (rightContainer.childNodes[i] as HTMLElement).style.top = -(e.target as HTMLElement).scrollTop + "px";
        }
    }
    /* tslint:enable:prefer-for-of */
}

export function handleScrollXEvent(e: Event, heads: HTMLElement) {
    /* tslint:disable:prefer-for-of */
    for (let i = 0; i < heads.childNodes.length; i++) {
        (heads.childNodes[i] as HTMLElement).style.left = -(e.target as HTMLElement).scrollLeft + "px";
    }
    /* tslint:enable:prefer-for-of */
}
