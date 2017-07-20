[![Dependency Status](https://david-dm.org/plantain-00/grid-js-component.svg)](https://david-dm.org/plantain-00/grid-js-component)
[![devDependency Status](https://david-dm.org/plantain-00/grid-js-component/dev-status.svg)](https://david-dm.org/plantain-00/grid-js-component#info=devDependencies)
[![Build Status](https://travis-ci.org/plantain-00/grid-js-component.svg?branch=master)](https://travis-ci.org/plantain-00/grid-js-component)
[![npm version](https://badge.fury.io/js/grid-js-component.svg)](https://badge.fury.io/js/grid-js-component)
[![Downloads](https://img.shields.io/npm/dm/grid-js-component.svg)](https://www.npmjs.com/package/grid-js-component)

# grid-js-component
A reactjs and vuejs grid component.

#### features

+ vuejs component
+ reactjs component
+ scrollbar
+ custom cell component
+ freeze columns
+ sort
+ resize

#### install

`npm i grid-js-component`

#### link css

```html
<link rel="stylesheet" href="./node_modules/grid-js-component/grid.min.css" />
```

#### vuejs component demo

`npm i vue vue-class-component`

```ts
import "grid-js-component/vue";
```

```html
<grid :data="data"
    @sort="sort($event)"
    @click="click($event)"
    @action="action($event)">
</grid>
```

the online demo: https://plantain-00.github.io/grid-js-component/demo/vue/index.html

#### reactjs component demo

```ts
import { Grid } from "grid-js-component/react";
```

```jsx
<Grid data={this.data}
    sort={sortData => this.sort(sortData)}
    click={clickData => this.click(clickData)}
    action={actionData => this.action(actionData)}>
</Grid>
```

the online demo: https://plantain-00.github.io/grid-js-component/demo/react/index.html

#### properties and events of the component

name | type | description
--- | --- | ---
data | [GridData](#grid-data-structure) | the data of the grid
resize | boolean? | whether the column can be resized
sort | (sortData: [SortData](#sort-data-structure)) => void | triggered when click a header to sort
click | (clickData: [ClickData](#click-data-structure)) => void | triggered when click a cell
action | (actionData: [ActionData](#action-data-structure)) => void | triggered when custom component triggered events
resized | (resizeData: [ResizeData](#resize-data-structure)) => void | triggered when resizing action finished

#### grid data structure

```ts
type GridData = {
    headers: GridRowData;
    rows: GridRowData[];
    leftHeaders?: GridRowData;
    leftRows?: GridRowData[];
    rightHeaders?: GridRowData;
    rightRows?: GridRowData[];
    sortColumn?: string;
    sortType?: "asc" | "desc";
};

type GridRowData = {
    cells: GridCellData[];
    style?: string; // the class string of the row, used to set style
    width?: number;
};

type GridCellData = {
    value: any; // the value in the cell
    component?: string | Function; //  if exists, show the component rather than the value in the cell
    style?: string; // the class string of the cell, used to set style
    width?: number;
};
```

#### sort data structure

```ts
type SortData = {
    cell: GridCellData; // the cell object clicked
    header: GridRowData; // the header object clicked
    columnIndex: number; // the column index clicked
};
```

#### click data structure

```ts
type ClickData = {
    cell: GridCellData; // the cell object clicked
    row: GridRowData; // the row object clicked
    body: GridRowData[]; // the body object clicked
    rowIndex: number; // the row index clicked
    columnIndex: number; // the column index clicked
};
```

#### action data structure

```ts
type ActionData = {
    data: any; //  the raw event data from the custom component
} & (SortData | ClickData);
```

#### resize data structure

```ts
type ResizeData = {
    cellWidth: number;
    rowWidth: number;
    index: number;
};
```

#### properties and events of the custom component

name | type | description
--- | --- | ---
data | any | is `GridCellData.value`
action | (actionData: any) => void | the `actionData` is `ActionData.data`

#### general styles

+ grid
+ grid-main
+ grid-main-head
+ grid-main-head-row
+ grid-main-head-row-cell
+ grid-main-body
+ grid-main-body-row
+ grid-main-body-row-cell
+ grid-left
+ grid-left-head
+ grid-left-head-row
+ grid-left-head-row-cell
+ grid-left-body
+ grid-left-body-row
+ grid-left-body-row-cell
+ grid-right
+ grid-right-head
+ grid-right-head-row
+ grid-right-head-row-cell
+ grid-right-body
+ grid-right-body-row
+ grid-right-body-row-cell

#### changelogs

##### v4

```ts
// v3
import "grid-js-component/dist/vue";

// v4
import "grid-js-component/vue";
```

##### v3

```bash
// v2
sort: (columnName: string) => void;

// v3
sort: (sortData: common.SortData) => void;
```

##### v2

```bash
// v1
+ grid
+ grid-head
+ grid-head-row
+ grid-head-row-cell
+ grid-body
+ grid-body-row
+ grid-body-row-cell

// v2
+ grid-main
+ grid-main-head
+ grid-main-head-row
+ grid-main-head-row-cell
+ grid-main-body
+ grid-main-body-row
+ grid-main-body-row-cell
```
