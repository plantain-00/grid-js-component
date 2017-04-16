[![Dependency Status](https://david-dm.org/plantain-00/grid-js-component.svg)](https://david-dm.org/plantain-00/grid-js-component)
[![devDependency Status](https://david-dm.org/plantain-00/grid-js-component/dev-status.svg)](https://david-dm.org/plantain-00/grid-js-component#info=devDependencies)
[![Build Status](https://travis-ci.org/plantain-00/grid-js-component.svg?branch=master)](https://travis-ci.org/plantain-00/grid-js-component)
[![npm version](https://badge.fury.io/js/grid-js-component.svg)](https://badge.fury.io/js/grid-js-component)
[![Downloads](https://img.shields.io/npm/dm/grid-js-component.svg)](https://www.npmjs.com/package/grid-js-component)

# grid-js-component
A reactjs and vuejs grid component.

#### install

`npm i grid-js-component`

#### link css

```html
<link rel="stylesheet" href="./node_modules/grid-js-component/dist/grid.min.css" />
```

#### module bundler

This component should work with `webpack`, and it requires `npm install raw-loader --save-dev` to load templates.

#### vuejs component demo

`npm i vue vue-class-component`

```ts
import "grid-js-component/dist/vue";
```

```html
<grid :data="data">
</grid>
```

the online demo: https://plantain-00.github.io/grid-js-component/demo/vue/index.html

the source code of the demo: https://github.com/plantain-00/grid-js-component/tree/master/demo/vue

#### reactjs component demo

```ts
import { Grid } from "grid-js-component/dist/react";
```

```html
<Grid data={data} />
```

the online demo: https://plantain-00.github.io/grid-js-component/demo/react/index.html

the source code of the demo: https://github.com/plantain-00/grid-js-component/tree/master/demo/react

#### properties and events of the component

name | type | description
--- | --- | ---
data | [GridData](#grid-data-structure) | the data of the tree

#### grid data structure

```ts
type GridData = {
    headers: GridRowData;
    rows: GridRowData[];
    leftHeaders?: GridRowData;
    leftRows?: GridRowData[];
    rightHeaders?: GridRowData;
    rightRows?: GridRowData[];
};

type GridRowData = {
    cells: GridCellData[];
    style?: string; // the class string of the row, used to set style
};

type GridCellData = {
    value: any; // the value in the cell
    component?: string | Function; //  if exists, show the component rather than the value in the cell
    style?: string; // the class string of the cell, used to set style
};
```

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

#### features

+ vuejs component
+ reactjs component
+ scrollbar
+ custom cell component
+ freeze columns

#### changelogs

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
