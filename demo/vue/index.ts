import * as Vue from "vue";
import Component from "vue-class-component";

import "../../dist/vue";
import * as common from "../../dist/common";

Vue.component("proficiency-percent", {
    template: `<div :style="style">{{data}}%</div>`,
    props: ["data"],
    computed: {
        style(this: { data: number } & Vue) {
            return {
                width: this.data + "%",
                backgroundColor: this.data >= 50 ? "rgb(0, 160, 0)" : "rgb(255, 153, 0)",
            };
        },
    },
});

Vue.component("delete-button", {
    template: `<button @click="click()">delete</button>`,
    props: ["data"],
    methods: {
        click(this: { data: number } & Vue) {
            this.$emit("action", { type: "delete", id: this.data });
        },
    },
});

import { getViewData, sort, deleteOne, resized } from "../common";

function setComponents(viewData: common.GridData) {
    for (const row of viewData.rows) {
        row.cells[0].component = "proficiency-percent";
    }
    for (const row of viewData.rightRows!) {
        row.cells[0].component = "delete-button";
    }
}

const data = getViewData();
setComponents(data);

@Component({
    template: `
    <div>
        <a href="https://github.com/plantain-00/grid-js-component/tree/master/demo/vue/index.ts" target="_blank">the source code of the demo</a>
        <br/>
        <grid :data="data"
            resize="true"
            @sort="sort($event)"
            @click="click($event)"
            @action="action($event)"
            @resized="resized($event)">
        </grid>
        <p>
            clicked cell value: {{clickedCellValue}}
        </p>
    </div>
    `,
})
class App extends Vue {
    data = data;
    clickedCellValue = null;

    sort(sortData: common.SortData) {
        if (!sortData.cell.value) {
            return;
        }
        const sortType = this.data.sortType === "asc" ? "desc" : "asc";
        sort(sortData.cell.value, sortType);

        const viewData = getViewData();
        setComponents(viewData);
        viewData.sortColumn = sortData.cell.value;
        viewData.sortType = sortType;

        this.data = viewData;
    }
    click(clickData: common.ClickData) {
        this.clickedCellValue = clickData.cell.value;
    }
    action(actionData: common.ActionData) {
        deleteOne(actionData.data.id);

        const viewData = getViewData();
        setComponents(viewData);

        this.data = viewData;
    }
    resized(resizeData: common.ResizeData) {
        resized(resizeData);
    }
}

// tslint:disable-next-line:no-unused-expression
new App({ el: "#container" });
