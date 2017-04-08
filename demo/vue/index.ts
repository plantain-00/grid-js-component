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
                backgroundColor: "green",
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
