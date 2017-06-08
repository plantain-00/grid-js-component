import * as React from "react";
import * as ReactDOM from "react-dom";

import { Grid } from "../../dist/react";
import * as common from "../../dist/common";

const ProficiencyPercent: React.StatelessComponent<{ data: number }> = props => <div style={{
    width: props.data + "%",
    backgroundColor: props.data >= 50 ? "rgb(0, 160, 0)" : "rgb(255, 153, 0)",
}}>{props.data}%</div>;

const DeleteButton: React.StatelessComponent<{ data: number, action: (actionData: any) => void }> = props => <button onClick={e => props.action({ type: "delete", id: props.data })}>delete</button>;

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
                <a href="https://github.com/plantain-00/grid-js-component/tree/master/demo/react/index.tsx" target="_blank">the source code of the demo</a>
                <br />
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
