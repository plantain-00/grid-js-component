import Vue from "vue";
import Component from "vue-class-component";
import * as common from "./common";
export * from "./common";
import { vueGridTemplateHtml } from "./vue-variables";

@Component({
    template: vueGridTemplateHtml,
    props: ["data", "resize"],
})
class Grid extends Vue {
    data: common.GridData;
    resize?: boolean;

    private container: HTMLElement;
    private heads: HTMLElement;
    private leftContainer?: HTMLElement;
    private rightContainer?: HTMLElement;

    private resizingCell: common.GridCellData | null = null;
    private initialClientX: number;
    private initialWidth: number;
    private initialRowWidth: number;
    private resizingIndex: number | null = null;
    private canSort = true;
    private ps: common.Ps | null;

    sort(sortData: common.SortData) {
        if (this.canSort) {
            this.$emit("sort", sortData);
        } else {
            this.canSort = true;
        }
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

    resizeStart(e: MouseEvent, cell: common.GridCellData, columnIndex: number) {
        this.resizingCell = cell;
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.initialClientX = e.clientX;
        this.initialWidth = (e.target as HTMLElement).parentElement!.getClientRects()[0].width;
        this.initialRowWidth = (e.target as HTMLElement).parentElement!.parentElement!.getClientRects()[0].width;
        this.resizingIndex = columnIndex;
    }
    resizeEnd(e: MouseEvent) {
        this.resizingCell = null;

        if (!this.canSort) {
            const cellWidth = this.initialWidth + e.clientX - this.initialClientX;
            const rowWidth = this.initialRowWidth + e.clientX - this.initialClientX;
            const resizeData: common.ResizeData = {
                cellWidth,
                rowWidth,
                index: this.resizingIndex!,
            };
            this.$emit("resized", resizeData);
        }
    }
    mousemove(e: MouseEvent) {
        if (this.resizingCell) {
            e.preventDefault();
            const cellWidth = this.initialWidth + e.clientX - this.initialClientX;
            const rowWidth = this.initialRowWidth + e.clientX - this.initialClientX;
            this.resizingCell.width = cellWidth;
            this.data.headers.width = rowWidth;
            for (const row of this.data.rows) {
                row.width = rowWidth;
                row.cells[this.resizingIndex!].width = cellWidth;
            }
            this.canSort = false;
        }
    }
    getStyle(width: number | undefined) {
        return width ? { width } : {};
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

        this.ps = new common.Ps(this.container);

        this.container.addEventListener("ps-scroll-y", e => common.handleScrollYEvent((e.target as HTMLElement).scrollTop, this.leftContainer, this.rightContainer));
        this.container.addEventListener("ps-scroll-x", e => common.handleScrollXEvent((e.target as HTMLElement).scrollLeft, this.heads));
        this.container.addEventListener("ps-x-reach-start", e => common.handleScrollXEvent(0, this.heads));
        this.container.addEventListener("ps-x-reach-end", e => common.handleScrollXEvent(this.container.scrollLeft, this.heads));
        this.container.addEventListener("ps-y-reach-start", e => common.handleScrollYEvent(0, this.leftContainer, this.rightContainer));
        this.container.addEventListener("ps-y-reach-end", e => common.handleScrollYEvent(this.container.scrollTop, this.leftContainer, this.rightContainer));

        if (this.leftContainer) {
            this.leftContainer.addEventListener("wheel", e => common.updateVerticalScroll(e, this.container, this.ps, this.leftContainer, this.rightContainer));
        }
        if (this.rightContainer) {
            this.rightContainer.addEventListener("wheel", e => common.updateVerticalScroll(e, this.container, this.ps, this.leftContainer, this.rightContainer));
        }
        this.heads.addEventListener("wheel", e => common.updateHorizontalScroll(e, this.container, this.ps));
    }
    beforeDestroy() {
        if (this.container && this.ps) {
            this.ps.destroy();
            this.ps = null;

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
