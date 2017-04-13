import * as Vue from "vue";

import "../../dist/vue";
import { GridData } from "../../dist/common";

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

const data: GridData = {
    headers: {
        cells: [
            {
                value: "name",
            },
            {
                value: "proficiency",
                style: "test-cell-class",
            },
        ],
        style: "test-row-class",
    },
    rows: [
        {
            cells: [
                {
                    value: "John",
                },
                {
                    value: 30,
                    component: "proficiency-percent",
                },
            ],
        },
        {
            cells: [
                {
                    value: "Sara",
                },
                {
                    value: 90,
                    component: "proficiency-percent",
                },
            ],
        },
        {
            cells: [
                {
                    value: "Lili",
                },
                {
                    value: 10,
                    component: "proficiency-percent",
                },
            ],
        },
        {
            cells: [
                {
                    value: "Smith",
                },
                {
                    value: 70,
                    component: "proficiency-percent",
                },
            ],
        },
        {
            cells: [
                {
                    value: "Lucy",
                },
                {
                    value: 60,
                    component: "proficiency-percent",
                },
            ],
        },
        {
            cells: [
                {
                    value: "Emily",
                },
                {
                    value: 20,
                    component: "proficiency-percent",
                },
            ],
        },
    ],
};

/* tslint:disable:no-unused-expression */
new Vue({
    el: "#container",
    data: {
        data,
    },
});
