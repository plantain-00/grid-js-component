import * as Vue from "vue";

import "../../dist/vue";
import * as common from "../../dist/common";

Vue.component("proficiency-percent", {
    template: `<div :style="style">{{data}}%</div>`,
    props: ["data"],
    computed: {
        style(this: { data: number }) {
            return {
                width: this.data + "%",
                backgroundColor: this.data >= 50 ? "rgb(0, 160, 0)" : "rgb(255, 153, 0)",
            };
        },
    },
});

import { getViewData, sort } from "../common";

const data = getViewData();
for (const row of data.rows) {
    row.cells[0].component = "proficiency-percent";
}
console.log(data);

/* tslint:disable:no-unused-expression */
new Vue({
    el: "#container",
    data: {
        data,
        clickedCellValue: null,
    },
    methods: {
        sort(this: This, sortData: common.SortData) {
            const sortType = this.data.sortType === "asc" ? "desc" : "asc";
            sort(sortData.cell.value, sortType);

            const viewData = getViewData();
            for (const row of viewData.rows) {
                row.cells[0].component = "proficiency-percent";
            }
            viewData.sortColumn = sortData.cell.value;
            viewData.sortType = sortType;
            console.log(viewData);

            this.data = viewData;
        },
        click(this: This, clickData: common.ClickData) {
            this.clickedCellValue = clickData.cell.value;
        },
    },
});
/* tslint:enable:no-unused-expression */

type This = Vue & {
    data: typeof data;
    clickedCellValue: any;
};
