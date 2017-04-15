import * as React from "react";
import * as ReactDOM from "react-dom";
import * as common from "./common";

export class Grid extends React.Component<{ data: common.GridData; }, {}> {
    container: HTMLElement;
    heads: HTMLElement;
    leftContainer: HTMLElement;
    rightContainer: HTMLElement;

    componentDidMount() {
        this.heads = ReactDOM.findDOMNode(this).childNodes[1].childNodes[0] as HTMLElement;
        this.container = ReactDOM.findDOMNode(this).childNodes[1].childNodes[1] as HTMLElement;
        this.leftContainer = ReactDOM.findDOMNode(this).childNodes[0].childNodes[1] as HTMLElement;
        this.rightContainer = ReactDOM.findDOMNode(this).childNodes[2].childNodes[1] as HTMLElement;

        common.Ps.initialize(this.container);

        this.container.addEventListener("ps-scroll-x", e => {
            /* tslint:disable:prefer-for-of */
            for (let i = 0; i < this.heads.childNodes.length; i++) {
                (this.heads.childNodes[i] as HTMLElement).style.left = -(e.target as HTMLElement).scrollLeft + "px";
            }
            for (let i = 0; i < this.leftContainer.childNodes.length; i++) {
                (this.leftContainer.childNodes[i] as HTMLElement).style.top = -(e.target as HTMLElement).scrollTop + "px";
            }
            for (let i = 0; i < this.rightContainer.childNodes.length; i++) {
                (this.rightContainer.childNodes[i] as HTMLElement).style.top = -(e.target as HTMLElement).scrollTop + "px";
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
        let mainHead: JSX.Element | null = null;
        if (this.props.data.headers && this.props.data.headers.cells) {
            const headCells = this.props.data.headers.cells.map(cell => {
                const headCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number }>, { data: cell.value }) : cell.value;
                return (
                    <th className={"grid-main-head-row-cell " + (cell.style || "")}>
                        {headCell}
                    </th>
                );
            });
            mainHead = (
                <thead className="grid-main-head">
                    <tr className={"grid-main-head-row " + (this.props.data.headers.style || "")}>
                        {headCells}
                    </tr>
                </thead>
            );
        }

        let leftHead: JSX.Element | null = null;
        if (this.props.data.leftHeaders && this.props.data.leftHeaders.cells) {
            const headCells = this.props.data.leftHeaders.cells.map(cell => {
                const headCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number }>, { data: cell.value }) : cell.value;
                return (
                    <th className={"grid-left-head-row-cell " + (cell.style || "")}>
                        {headCell}
                    </th>
                );
            });
            leftHead = (
                <tr className={"grid-left-head-row " + (this.props.data.leftHeaders.style || "")}>
                    {headCells}
                </tr>
            );
        }

        let rightHead: JSX.Element | null = null;
        if (this.props.data.rightHeaders && this.props.data.rightHeaders.cells) {
            const headCells = this.props.data.rightHeaders.cells.map(cell => {
                const headCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number }>, { data: cell.value }) : cell.value;
                return (
                    <th className={"grid-right-head-row-cell " + (cell.style || "")}>
                        {headCell}
                    </th>
                );
            });
            rightHead = (
                <tr className={"grid-right-head-row " + (this.props.data.rightHeaders.style || "")}>
                    {headCells}
                </tr>
            );
        }

        const mainBody = this.props.data.rows.map(row => {
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
                </tr>
            );
        });
        const leftBody = this.props.data.leftRows ? this.props.data.leftRows.map(row => {
            const cells = row.cells.map(cell => {
                const bodyCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number }>, { data: cell.value }) : cell.value;
                return (
                    <td className={"grid-left-body-row-cell " + (cell.style || "")}>
                        {bodyCell}
                    </td>
                );
            });
            return (
                <tr className={"grid-left-body-row " + (row.style || "")}>
                    {cells}
                </tr>
            );
        }) : null;
        const rightBody = this.props.data.rightRows ? this.props.data.rightRows.map(row => {
            const cells = row.cells.map(cell => {
                const bodyCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number }>, { data: cell.value }) : cell.value;
                return (
                    <td className={"grid-right-body-row-cell " + (cell.style || "")}>
                        {bodyCell}
                    </td>
                );
            });
            return (
                <tr className={"grid-right-body-row " + (row.style || "")}>
                    {cells}
                </tr>
            );
        }) : null;

        return (
            <div className="grid">
                <table className="grid-left">
                    <thead className="grid-left-head">
                        {leftHead}
                    </thead>
                    <tbody className="grid-left-body">
                        {leftBody}
                    </tbody>
                </table>
                <table className="grid-main">
                    {mainHead}
                    <tbody className="grid-main-body">
                        {mainBody}
                    </tbody>
                </table>
                <table className="grid-right">
                    <thead className="grid-right-head">
                        {rightHead}
                    </thead>
                    <tbody className="grid-right-body">
                        {rightBody}
                    </tbody>
                </table>
            </div>
        );
    }
}
