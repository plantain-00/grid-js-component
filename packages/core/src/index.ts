/**
 * @public
 */
export type GridData = {
  headers: GridRowData;
  rows: GridRowData[];
  leftHeaders?: GridRowData;
  leftRows?: GridRowData[];
  rightHeaders?: GridRowData;
  rightRows?: GridRowData[];
  sortColumn?: string;
  sortType?: 'asc' | 'desc';
}

/**
 * @public
 */
export type GridRowData = {
  cells: GridCellData[];
  style?: string;
  width?: number;
}

/**
 * @public
 */
export type GridCellData<T = any> = {
  value: T;
  component?: string | Function;
  style?: string;
  width?: number;
}

/**
 * @public
 */
export type SortData = {
  cell: GridCellData;
  header: GridRowData;
  columnIndex: number;
}

/**
 * @public
 */
export type ClickData = {
  cell: GridCellData;
  row: GridRowData;
  body: GridRowData[];
  rowIndex: number;
  columnIndex: number;
}

/**
 * @public
 */
export type ActionData<T = any> = {
  data: T;
} & (SortData | ClickData)

/**
 * @public
 */
export type ResizeData = {
  cellWidth: number;
  rowWidth: number;
  index: number;
}

import Ps from 'perfect-scrollbar'

export { Ps }

function getDeltaFromEvent(e: WheelEvent) {
  let deltaX = e.deltaX
  let deltaY = -1 * e.deltaY

  if (typeof deltaX === 'undefined' || typeof deltaY === 'undefined') {
    // OS X Safari
    deltaX = -1 * (e as any).wheelDeltaX / 6
    deltaY = (e as any).wheelDeltaY / 6
  }

  if (e.deltaMode && e.deltaMode === 1) {
    // Firefox in deltaMode 1: Line scrolling
    deltaX *= 10
    deltaY *= 10
  }

  if (isNaN(deltaX) && isNaN(deltaY)) {
    // IE in some mouse drivers
    deltaX = 0
    deltaY = (e as any).wheelDelta
  }

  if (e.shiftKey) {
    // reverse axis with shift key
    return { deltaX: -deltaY, deltaY: -deltaX }
  }
  return { deltaX, deltaY }
}

/**
 * @public
 */
export function updateVerticalScroll(e: WheelEvent, container: HTMLElement, ps: Ps | null, leftContainer: HTMLElement | undefined, rightContainer: HTMLElement | undefined) {
  const { deltaY } = getDeltaFromEvent(e)
  const scrollTop = container.scrollTop - deltaY
  container.scrollTop = scrollTop
  if (ps) {
    ps.update()
  }
  handleScrollYEvent(scrollTop, leftContainer, rightContainer)
}

/**
 * @public
 */
export function updateHorizontalScroll(e: WheelEvent, container: HTMLElement, ps: Ps | null) {
  const { deltaX } = getDeltaFromEvent(e)
  container.scrollLeft += deltaX
  if (ps) {
    ps.update()
  }
}

/**
 * @public
 */
export function handleScrollYEvent(scrollTop: number, leftContainer: HTMLElement | undefined, rightContainer: HTMLElement | undefined) {
  if (leftContainer) {
    for (let i = 0; i < leftContainer.childNodes.length; i++) {
      (leftContainer.childNodes[i] as HTMLElement).style.top = -scrollTop + 'px'
    }
  }
  if (rightContainer) {
    for (let i = 0; i < rightContainer.childNodes.length; i++) {
      (rightContainer.childNodes[i] as HTMLElement).style.top = -scrollTop + 'px'
    }
  }
}

/**
 * @public
 */
export function handleScrollXEvent(scrollLeft: number, heads: HTMLElement) {
  for (let i = 0; i < heads.childNodes.length; i++) {
    (heads.childNodes[i] as HTMLElement).style.left = -scrollLeft + 'px'
  }
}
