import * as Vue from "vue";

import "../../dist/vue";

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

import * as common from "../common";

const data = common.getViewData();
for (const row of data.rows) {
    row.cells[0].component = "proficiency-percent";
}
console.log(data);

/* tslint:disable:no-unused-expression */
new Vue({
    el: "#container",
    data: {
        data,
    },
    methods: {
        sort(this: This, column: string) {
            const sortType = this.data.sortType === "asc" ? "desc" : "asc";
            common.sort(column, sortType);

            const viewData = common.getViewData();
            for (const row of viewData.rows) {
                row.cells[0].component = "proficiency-percent";
            }
            viewData.sortColumn = column;
            viewData.sortType = sortType;
            console.log(viewData);

            this.data = viewData;
        },
    },
});
/* tslint:enable:no-unused-expression */

type This = Vue & {
    data: typeof data;
};
