import * as Vue from "vue";
import * as Ps from "perfect-scrollbar";

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

const container = document.getElementsByTagName("tbody")[0];
Ps.initialize(container);

const heads = document.getElementsByClassName("head-row");

container.addEventListener("ps-scroll-x", e => {
    /* tslint:disable:prefer-for-of */
    for (let i = 0; i < heads.length; i++) {
        (heads[i] as HTMLElement).style.left = -(e.target as HTMLElement).scrollLeft + "px";
    }
});
