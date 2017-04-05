import * as Vue from "vue";
import Component from "vue-class-component";

@Component({
    template: ``,
    props: ["data", "last", "checkbox", "path", "draggable"],
})
class Grid extends Vue {
}

Vue.component("grid", Grid);
