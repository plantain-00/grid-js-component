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

#### vuejs component demo

`npm i vue vue-class-component`

```ts
import "grid-js-component/dist/vue";
<grid :data="data">
</grid>
```

the online demo: https://plantain-00.github.io/grid-js-component/demo/vue/index.html

the source code of the demo: https://github.com/plantain-00/grid-js-component/tree/master/demo/vue

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
};

type GridCellData = {
    value: any; // the value in the cell
    component?: string; //  if exists, show the component rather than the value in the cell
};
```

#### features

+ vuejs component
+ reactjs component
+ angular component
+ scrollbar
+ custom cell component
