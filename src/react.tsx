import * as React from "react";
import * as ReactDOM from "react-dom";
import * as common from "./common";

export class Grid extends React.Component<{ data: common.GridData; }, {}> {
    container: HTMLElement;
    heads: HTMLElement;

    componentDidMount() {
        this.heads = ReactDOM.findDOMNode(this).childNodes[0] as HTMLElement;
        this.container = ReactDOM.findDOMNode(this).childNodes[1] as HTMLElement;

        common.Ps.initialize(this.container);

        this.container.addEventListener("ps-scroll-x", e => {
            /* tslint:disable:prefer-for-of */
            for (let i = 0; i < this.heads.childNodes.length; i++) {
                (this.heads.childNodes[i] as HTMLElement).style.left = -(e.target as HTMLElement).scrollLeft + "px";
            }
            /* tslint:enable:prefer-for-of */
        });
    }
    componentWillUnmount() {
        if (this.container) {
            common.Ps.destroy(this.container);
            this.container.removeEventListener("ps-scroll-x");
        }
    }

    render() {
        let head: JSX.Element | null = null;
        if (this.props.data.headers && this.props.data.headers.cells) {
            const headCells = this.props.data.headers.cells.map(cell => {
                const headCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number }>, { data: cell.value }) : cell.value;
                return (
                    <th className={"grid-main-head-row-cell " + (cell.style || "")}>
                        {headCell}
                    </th >
                );
            });
            head = (
                <thead className="grid-main-head">
                    <tr className={"grid-main-head-row " + (this.props.data.headers.style || "")}>
                        {headCells}
                    </tr>
                </thead >
            );
        }
        const body = this.props.data.rows.map(row => {
            const cells = row.cells.map(cell => {
                const bodyCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number }>, { data: cell.value }) : cell.value;
                return (
                    <td className={"grid-main-body-row-cell " + (cell.style || "")}>
                        {bodyCell}
                    </td>
                );
            });
            return (
                <tr className={"grid-main-body-row " + (row.style || "")}>
                    {cells}
                </tr >
            );
        });
        return (
            <table className="grid">
                {head}
                <tbody className="grid-main-body">
                    {body}
                </tbody >
            </table >
        );
    }
}
