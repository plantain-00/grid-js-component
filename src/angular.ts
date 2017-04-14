import { Component, Input, ViewChild } from "@angular/core";
import * as common from "./common";

@Component({
    selector: "grid",
    template: require("raw-loader!./angular-grid.html"),
})
export class GridComponent {
    @Input()
    data: common.GridData;

    @ViewChild("container")
    container: HTMLElement;
    @ViewChild("heads")
    heads: HTMLElement;

    mounted() {
        common.Ps.initialize(this.container);

        this.container.addEventListener("ps-scroll-x", e => {
            if (this.heads && this.heads.childNodes) {
                /* tslint:disable:prefer-for-of */
                for (let i = 0; i < this.heads.childNodes.length; i++) {
                    (this.heads.childNodes[i] as HTMLElement).style.left = -(e.target as HTMLElement).scrollLeft + "px";
                }
                /* tslint:enable:prefer-for-of */
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
