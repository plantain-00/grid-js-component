[![Dependency Status](https://david-dm.org/plantain-00/grid-js-component.svg)](https://david-dm.org/plantain-00/grid-js-component)
[![devDependency Status](https://david-dm.org/plantain-00/grid-js-component/dev-status.svg)](https://david-dm.org/plantain-00/grid-js-component#info=devDependencies)
[![Build Status](https://travis-ci.org/plantain-00/grid-js-component.svg?branch=master)](https://travis-ci.org/plantain-00/grid-js-component)
[![npm version](https://badge.fury.io/js/grid-js-component.svg)](https://badge.fury.io/js/grid-js-component)
[![Downloads](https://img.shields.io/npm/dm/grid-js-component.svg)](https://www.npmjs.com/package/grid-js-component)

# grid-js-component
A reactjs, angular and vuejs grid component.

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
<grid :data="data">
</grid>
```

the online demo: https://plantain-00.github.io/grid-js-component/demo/vue/index.html

the source code of the demo: https://github.com/plantain-00/grid-js-component/tree/master/demo/vue

#### reactjs component demo

```ts
import { Grid } from "grid-js-component/dist/react";
<Grid data={data} />
```

the online demo: https://plantain-00.github.io/grid-js-component/demo/react/index.html

the source code of the demo: https://github.com/plantain-00/grid-js-component/tree/master/demo/react

#### properties and events of the component

name | type | description
--- | --- | ---
data | [GridData](#grid-data-structure)[] | the data of the tree

#### grid data structure

```ts
type GridData = {
    headers: GridRowData;
    rows: GridRowData[];
};

type GridRowData = {
    cells: GridCellData[];
    style?: string; // the class string of the row, used to set style
};

type GridCellData = {
    value: any; // the value in the cell
    component?: string | React.ComponentClass<{ data: any }>; //  if exists, show the component rather than the value in the cell
    style?: string; // the class string of the cell, used to set style
};
```

#### general styles

```less
.grid {
  border-collapse: collapse;
  width: 150px;
}

.grid-head {
  width: 150px;
}

.grid-body {
  height: 100px;
  width: 150px;
}

.grid-head-row { }
.grid-body-row { }

.grid-head-row-cell,
.grid-body-row-cell {
  border: 1px solid black;
  width: 100px;
  min-width: 100px;
  height: 20px;
}
```

#### features

+ vuejs component
+ reactjs component
+ angular component
+ scrollbar
+ custom cell component
