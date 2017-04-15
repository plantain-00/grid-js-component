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

import { data } from "../common";

for (const row of data.rows) {
    row.cells[0].component = ProficiencyPercent;
}
console.log(data);

class Main extends React.Component<{}, {}> {
    render() {
        return (
            <Grid data={data}></Grid>
        );
    }
}

ReactDOM.render(<Main />, document.getElementById("container"));
