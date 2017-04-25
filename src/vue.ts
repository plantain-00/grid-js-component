import * as Vue from "vue";
import Component from "vue-class-component";
import * as common from "./common";
import { srcVueGridHtml } from "./vue-variables";

@Component({
    template: srcVueGridHtml,
    props: ["data"],
})
class Grid extends Vue {
    data: common.GridData;

    container: HTMLElement;
    heads: HTMLElement;
    leftContainer?: HTMLElement;
    rightContainer?: HTMLElement;

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
        if (this.$el.childNodes[0].childNodes.length > 1) {
            this.leftContainer = this.$el.childNodes[0].childNodes[1] as HTMLElement;
        }
        if (this.$el.childNodes[2].childNodes.length > 1) {
            this.rightContainer = this.$el.childNodes[2].childNodes[1] as HTMLElement;
        }

        common.Ps.initialize(this.container);

        this.container.addEventListener("ps-scroll-y", e => common.handleScrollYEvent(e, this.leftContainer, this.rightContainer));
        this.container.addEventListener("ps-scroll-x", e => common.handleScrollXEvent(e, this.heads));

        if (this.leftContainer) {
            this.leftContainer.addEventListener("mousewheel", e => common.updateVerticalScroll(e, this.container));
        }
        if (this.rightContainer) {
            this.rightContainer.addEventListener("mousewheel", e => common.updateVerticalScroll(e, this.container));
        }
        this.heads.addEventListener("mousewheel", e => common.updateHorizontalScroll(e, this.container));
    }
    beforeDestroy() {
        if (this.container) {
            common.Ps.destroy(this.container);

            this.container.removeEventListener("ps-scroll-x");
            this.container.removeEventListener("ps-scroll-y");

            if (this.leftContainer) {
                this.leftContainer.removeEventListener("mousewheel");
            }
            if (this.rightContainer) {
                this.rightContainer.removeEventListener("mousewheel");
            }
            this.heads.removeEventListener("mousewheel");
        }
    }
}

Vue.component("grid", Grid);
