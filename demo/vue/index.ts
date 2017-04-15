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

import { data } from "../common";

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
});
/* tslint:enable:no-unused-expression */
