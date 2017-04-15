import "core-js/es6";
import "core-js/es7/reflect";
import "zone.js/dist/zone";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode, Input } from "@angular/core";

enableProdMode();

import { Component } from "@angular/core";

import { GridData } from "../../dist/common";

@Component({
    selector: "proficiency-percent",
    template: `<div [style]="style">{{data}}%</div>`,
})
class ProficiencyPercentComponent {
    @Input()
    data: number;

    get style() {
        return {
            width: this.data + "%",
            backgroundColor: this.data >= 50 ? "rgb(0, 160, 0)" : "rgb(255, 153, 0)",
        };
    }
}

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
                    component: ProficiencyPercentComponent,
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
                    component: ProficiencyPercentComponent,
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
                    component: ProficiencyPercentComponent,
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
                    component: ProficiencyPercentComponent,
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
                    component: ProficiencyPercentComponent,
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
                    component: ProficiencyPercentComponent,
                },
            ],
        },
    ],
};

@Component({
    selector: "app",
    template: `<grid [data]="data"></grid>`,
})
export class MainComponent {
    data = data;
}

import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { GridComponent } from "../../dist/angular";

@NgModule({
    imports: [BrowserModule, FormsModule],
    declarations: [MainComponent, GridComponent],
    bootstrap: [MainComponent],
    // entryComponents: [ProficiencyPercentComponent],
})
class MainModule { }

platformBrowserDynamic().bootstrapModule(MainModule);
