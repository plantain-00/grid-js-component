import * as React from "react";
import * as ReactDOM from "react-dom";

import { Grid } from "../../dist/react";
import { GridData } from "../../dist/common";

class ProficiencyPercent extends React.Component<{ data: number }, {}> {
    get style(): React.CSSProperties {
        return {
            width: this.props.data + "%",
            backgroundColor: this.props.data >= 50 ? "rgb(0, 160, 0)" : "rgb(255, 153, 0)",
            padding: "3px",
        };
    }
    render() {
        return (
            <div style={this.style}>{this.props.data}%</div>
        );
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
                    component: ProficiencyPercent,
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
                    component: ProficiencyPercent,
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
                    component: ProficiencyPercent,
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
                    component: ProficiencyPercent,
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
                    component: ProficiencyPercent,
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
                    component: ProficiencyPercent,
                },
            ],
        },
    ],
};

class Main extends React.Component<{}, {}> {
    render() {
        return (
            <Grid data={data}></Grid>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById("container"));
