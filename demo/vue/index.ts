import * as Vue from "vue";

import "../../dist/vue";
import { data } from "../common";

Vue.component("proficiency-percent", {
    template: `<div :style="getStyle()">{{data}}%</div>`,
    props: ["data"],
    methods: {
        getStyle(this: any) {
            return {
                width: this.data + "%",
                backgroundColor: this.data >= 50 ? "rgb(0, 160, 0)" : "rgb(255, 153, 0)",
                padding: "3px",
            };
        },
    },
});

/* tslint:disable:no-unused-expression */
new Vue({
    el: "#container",
    data: {
        data,
    },
});
