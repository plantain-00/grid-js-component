import * as React from "react";
import * as ReactDOM from "react-dom";
import * as common from "./common";

export class Grid extends React.Component<{
    data: common.GridData;

    sort: (sortColumn: string) => void;
    click: (clickData: common.ClickData) => void;
}, {}> {
    container: HTMLElement;
    heads: HTMLElement;
    leftContainer: HTMLElement;
    rightContainer: HTMLElement;

    sort(column: string) {
        this.props.sort(column);
    }

    isAsc(column: string) {
        return this.props.data.sortType === "asc" && this.props.data.sortColumn === column;
    }
    isDesc(column: string) {
        return this.props.data.sortType === "desc" && this.props.data.sortColumn === column;
    }

    click(clickData: common.ClickData) {
        this.props.click(clickData);
    }

    componentDidMount() {
        this.heads = ReactDOM.findDOMNode(this).childNodes[1].childNodes[0] as HTMLElement;
        this.container = ReactDOM.findDOMNode(this).childNodes[1].childNodes[1] as HTMLElement;
        this.leftContainer = ReactDOM.findDOMNode(this).childNodes[0].childNodes[1] as HTMLElement;
        this.rightContainer = ReactDOM.findDOMNode(this).childNodes[2].childNodes[1] as HTMLElement;

        common.Ps.initialize(this.container);

        this.container.addEventListener("ps-scroll-x", e => common.handleScrollEvent(e, this.heads, this.leftContainer, this.rightContainer));

        if (this.props.data.leftRows) {
            this.leftContainer.addEventListener("mousewheel", e => common.updateScroll(e, this.container));
        }
        if (this.props.data.rightRows) {
            this.rightContainer.addEventListener("mousewheel", e => common.updateScroll(e, this.container));
        }
    }
    componentWillUnmount() {
        if (this.container) {
            common.Ps.destroy(this.container);

            this.container.removeEventListener("ps-scroll-x");

            if (this.props.data.leftRows) {
                this.leftContainer.removeEventListener("mousewheel");
            }
            if (this.props.data.rightRows) {
                this.rightContainer.removeEventListener("mousewheel");
            }
        }
    }

    render() {
        let mainHead: JSX.Element | null = null;
        if (this.props.data.headers && this.props.data.headers.cells) {
            const headCells = this.props.data.headers.cells.map(cell => {
                const headCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number }>, { data: cell.value }) : cell.value;
                const ascMarker = this.isAsc(cell.value) ? (
                    <svg width="10" height="10">
                        <polygon points="0,10 5,0 10,10"></polygon>
                    </svg>
                ) : null;
                const descMarker = this.isDesc(cell.value) ? (
                    <svg width="10" height="10">
                        <polygon points="0,0 5,10 10,0"></polygon>
                    </svg>
                ) : null;
                return (
                    <th className={"grid-main-head-row-cell " + (cell.style || "")}
                        onClick={e => this.sort(cell.value)}>
                        {ascMarker}
                        {descMarker}
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
                const ascMarker = this.isAsc(cell.value) ? (
                    <svg width="10" height="10">
                        <polygon points="0,10 5,0 10,10"></polygon>
                    </svg>
                ) : null;
                const descMarker = this.isDesc(cell.value) ? (
                    <svg width="10" height="10">
                        <polygon points="0,0 5,10 10,0"></polygon>
                    </svg>
                ) : null;
                return (
                    <th className={"grid-left-head-row-cell " + (cell.style || "")}
                        onClick={e => this.sort(cell.value)}>
                        {ascMarker}
                        {descMarker}
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
                const ascMarker = this.isAsc(cell.value) ? (
                    <svg width="10" height="10">
                        <polygon points="0,10 5,0 10,10"></polygon>
                    </svg>
                ) : null;
                const descMarker = this.isDesc(cell.value) ? (
                    <svg width="10" height="10">
                        <polygon points="0,0 5,10 10,0"></polygon>
                    </svg>
                ) : null;
                return (
                    <th className={"grid-right-head-row-cell " + (cell.style || "")}
                        onClick={e => this.sort(cell.value)}>
                        {ascMarker}
                        {descMarker}
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

        const mainBody = this.props.data.rows.map((row, rowIndex) => {
            const cells = row.cells.map((cell, columnIndex) => {
                const bodyCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number }>, { data: cell.value }) : cell.value;
                return (
                    <td className={"grid-main-body-row-cell " + (cell.style || "")}
                        onClick={() => this.click({ cell, row, body: this.props.data.rows, rowIndex, columnIndex })}>
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
        const leftBody = this.props.data.leftRows ? this.props.data.leftRows.map((row, rowIndex) => {
            const cells = row.cells.map((cell, columnIndex) => {
                const bodyCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number }>, { data: cell.value }) : cell.value;
                return (
                    <td className={"grid-left-body-row-cell " + (cell.style || "")}
                        onClick={() => this.click({ cell, row, body: this.props.data.leftRows!, rowIndex, columnIndex })}>
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
        const rightBody = this.props.data.rightRows ? this.props.data.rightRows.map((row, rowIndex) => {
            const cells = row.cells.map((cell, columnIndex) => {
                const bodyCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number }>, { data: cell.value }) : cell.value;
                return (
                    <td className={"grid-right-body-row-cell " + (cell.style || "")}
                        onClick={() => this.click({ cell, row, body: this.props.data.rightRows!, rowIndex, columnIndex })}>
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
