import * as Vue from "vue";
import Component from "vue-class-component";
import * as common from "./common";

@Component({
    template: require("raw-loader!./vue-grid.html"),
    props: ["data"],
})
class Grid extends Vue {
    data: common.GridData;

    container: HTMLElement;
    heads: HTMLElement;
    leftContainer: HTMLElement;
    rightContainer: HTMLElement;

    sort(sortData: common.SortData) {
        this.$emit("sort", sortData);
    }

    isAsc(column: string) {
        return this.data.sortType === "asc" && this.data.sortColumn !== "" && this.data.sortColumn === column;
    }
    isDesc(column: string) {
        return this.data.sortType === "desc" && this.data.sortColumn !== "" && this.data.sortColumn === column;
    }

    click(clickData: common.ClickData) {
        this.$emit("click", clickData);
    }

    action(actionData: common.ActionData) {
        this.$emit("action", actionData);
    }

    mounted() {
        this.heads = this.$el.childNodes[1].childNodes[0] as HTMLElement;
        this.container = this.$el.childNodes[1].childNodes[1] as HTMLElement;
        this.leftContainer = this.$el.childNodes[0].childNodes[1] as HTMLElement;
        this.rightContainer = this.$el.childNodes[2].childNodes[1] as HTMLElement;

        common.Ps.initialize(this.container);

        this.container.addEventListener("ps-scroll-x", e => common.handleScrollEvent(e, this.heads, this.leftContainer, this.rightContainer));

        if (this.data.leftRows) {
            this.leftContainer.addEventListener("mousewheel", e => common.updateScroll(e, this.container));
        }
        if (this.data.rightRows) {
            this.rightContainer.addEventListener("mousewheel", e => common.updateScroll(e, this.container));
        }
    }
    beforeDestroy() {
        if (this.container) {
            common.Ps.destroy(this.container);

            this.container.removeEventListener("ps-scroll-x");

            if (this.data.leftRows) {
                this.leftContainer.removeEventListener("mousewheel");
            }
            if (this.data.rightRows) {
                this.rightContainer.removeEventListener("mousewheel");
            }
        }
    }
}

Vue.component("grid", Grid);
