import * as React from "react";
import * as ReactDOM from "react-dom";

import { Grid, GridData, SortData, ClickData, ActionData, ResizeData } from "../../dist/react";

const ProficiencyPercent: React.StatelessComponent<{ data: number }> = props => <div style={{
    width: props.data + "%",
    backgroundColor: props.data >= 50 ? "rgb(0, 160, 0)" : "rgb(255, 153, 0)",
}}>{props.data}%</div>;

const DeleteButton: React.StatelessComponent<{ data: number, action: (actionData: any) => void }> = props => <button onClick={e => props.action({ type: "delete", id: props.data })}>delete</button>;

import { getViewData, sort, deleteOne, resized } from "../common";

function setComponents(viewData: GridData) {
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
    private data = data;
    private clickedCellValue: any = null;

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

    private sort(sortData: SortData) {
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

    private click(clickData: ClickData) {
        this.clickedCellValue = clickData.cell.value;
        this.setState({ clickedCellValue: this.clickedCellValue });
    }

    private action(actionData: ActionData<{ id: number }>) {
        deleteOne(actionData.data.id);

        const viewData = getViewData();
        setComponents(viewData);

        this.data = viewData;
        this.setState({ data: this.data });
    }

    private resized(resizeData: ResizeData) {
        resized(resizeData);
    }
}

ReactDOM.render(<Main /> as any, document.getElementById("container"));
