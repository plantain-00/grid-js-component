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

class DeleteButton extends React.Component<{ data: number, action: (actionData: any) => void }, {}> {
    click() {
        this.props.action({ type: "delete", id: this.props.data });
    }
    render() {
        return (
            <button onClick={e => this.click()}>delete</button>
        );
    }
}

import { getViewData, sort, deleteOne, resized } from "../common";

function setComponents(viewData: common.GridData) {
    for (const row of viewData.rows) {
        row.cells[0].component = ProficiencyPercent;
    }
    for (const row of viewData.rightRows!) {
        row.cells[0].component = DeleteButton;
    }
}

const data = getViewData();
setComponents(data);

class Main extends React.Component<{}, {}> {
    data = data;
    clickedCellValue: any = null;

    sort(sortData: common.SortData) {
        if (!sortData.cell.value) {
            return;
        }
        const sortType = this.data.sortType === "asc" ? "desc" : "asc";
        sort(sortData.cell.value, sortType);

        const viewData = getViewData();
        setComponents(viewData);
        viewData.sortColumn = sortData.cell.value;
        viewData.sortType = sortType;

        this.data = viewData;
        this.setState({ data: this.data });
    }

    click(clickData: common.ClickData) {
        this.clickedCellValue = clickData.cell.value;
        this.setState({ clickedCellValue: this.clickedCellValue });
    }

    action(actionData: common.ActionData) {
        deleteOne(actionData.data.id);

        const viewData = getViewData();
        setComponents(viewData);

        this.data = viewData;
        this.setState({ data: this.data });
    }

    resized(resizeData: common.ResizeData) {
        resized(resizeData);
    }

    render() {
        return (
            <div>
                <Grid data={this.data}
                    resize={true}
                    sort={sortData => this.sort(sortData)}
                    click={clickData => this.click(clickData)}
                    action={actionData => this.action(actionData)}
                    resized={resizeData => this.resized(resizeData)}>
                </Grid>
                <p>
                    clicked cell value: {this.clickedCellValue}
                </p>
            </div>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById("container"));
