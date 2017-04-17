import * as React from "react";
import * as ReactDOM from "react-dom";

import { Grid } from "../../dist/react";

class ProficiencyPercent extends React.Component<{ data: number }, {}> {
    get style(): React.CSSProperties {
        return {
            width: this.props.data + "%",
            backgroundColor: this.props.data >= 50 ? "rgb(0, 160, 0)" : "rgb(255, 153, 0)",
        };
    }
    render() {
        return (
            <div style={this.style}>{this.props.data}%</div>
        );
    }
}

import * as common from "../common";

const data = common.getViewData();
for (const row of data.rows) {
    row.cells[0].component = ProficiencyPercent;
}
console.log(data);

class Main extends React.Component<{}, {}> {
    data = data;

    sort(column: string) {
        const sortType = this.data.sortType === "asc" ? "desc" : "asc";
        common.sort(column, sortType);

        const viewData = common.getViewData();
        for (const row of viewData.rows) {
            row.cells[0].component = ProficiencyPercent;
        }
        viewData.sortColumn = column;
        viewData.sortType = sortType;
        console.log(viewData);

        this.data = viewData;
        this.setState({ data: this.data });
    }

    render() {
        return (
            <Grid data={this.data}
                sort={column => this.sort(column)}>
            </Grid>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById("container"));
