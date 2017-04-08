import * as Vue from "vue";
import Component from "vue-class-component";
import * as common from "./common";

@Component({
    template: require("raw-loader!./vue-grid.html"),
    props: ["data"],
})
class Grid extends Vue {
    data: common.GridData;
}

Vue.component("grid", Grid);
