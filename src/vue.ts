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
    heads: HTMLCollectionOf<Element>;

    mounted() {
        this.container = document.getElementsByClassName("grid-body")[0] as HTMLElement;
        common.Ps.initialize(this.container);
        this.heads = document.getElementsByClassName("grid-head-row");

        this.container.addEventListener("ps-scroll-x", e => {
            /* tslint:disable:prefer-for-of */
            for (let i = 0; i < this.heads.length; i++) {
                (this.heads[i] as HTMLElement).style.left = -(e.target as HTMLElement).scrollLeft + "px";
            }
        });
    }
    beforeDestroy() {
        if (this.container) {
            common.Ps.destroy(this.container);
            this.container.removeEventListener("ps-scroll-x");
        }
    }
}

Vue.component("grid", Grid);
