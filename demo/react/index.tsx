import * as React from "react";
import * as ReactDOM from "react-dom";

import { Grid } from "../../dist/react";
import * as common from "../../dist/common";

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

import { getViewData, sort } from "../common";

const data = getViewData();
for (const row of data.rows) {
    row.cells[0].component = ProficiencyPercent;
}
console.log(data);

class Main extends React.Component<{}, {}> {
    data = data;
    clickedCellValue: any = null;

    sort(sortData: common.SortData) {
        const sortType = this.data.sortType === "asc" ? "desc" : "asc";
        sort(sortData.cell.value, sortType);

        const viewData = getViewData();
        for (const row of viewData.rows) {
            row.cells[0].component = ProficiencyPercent;
        }
        viewData.sortColumn = sortData.cell.value;
        viewData.sortType = sortType;
        console.log(viewData);

        this.data = viewData;
        this.setState({ data: this.data });
    }

    click(clickData: common.ClickData) {
        this.clickedCellValue = clickData.cell.value;
        this.setState({ clickedCellValue: this.clickedCellValue });
    }

    render() {
        return (
            <div>
                <Grid data={this.data}
                    sort={sortData => this.sort(sortData)}
                    click={clickData => this.click(clickData)}>
                </Grid>
                <p>
                    clicked cell value: {this.clickedCellValue}
                </p>
            </div>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById("container"));
