import * as React from "react";
import * as ReactDOM from "react-dom";
import * as common from "./common";

export class Grid extends React.Component<{
    data: common.GridData;
    resize?: boolean;
    sort: (sortData: common.SortData) => void;
    click: (clickData: common.ClickData) => void;
    action: (actionData: common.ActionData) => void;
}, {}> {
    container: HTMLElement;
    heads: HTMLElement;
    leftContainer?: HTMLElement;
    rightContainer?: HTMLElement;

    resizingCell: common.GridCellData | null = null;
    initialClientX: number;
    initialWidth: number;
    initialRowWidth: number;
    resizingIndex: number | null = null;
    canSort = true;

    sort(sortData: common.SortData) {
        if (this.canSort) {
            this.props.sort(sortData);
        } else {
            this.canSort = true;
        }
    }

    isAsc(column: string) {
        return this.props.data.sortType === "asc" && this.props.data.sortColumn !== "" && this.props.data.sortColumn === column;
    }
    isDesc(column: string) {
        return this.props.data.sortType === "desc" && this.props.data.sortColumn !== "" && this.props.data.sortColumn === column;
    }

    click(clickData: common.ClickData) {
        this.props.click(clickData);
    }

    action(actionData: common.ActionData) {
        this.props.action(actionData);
    }

    resizeStart(e: React.MouseEvent<HTMLDivElement>, cell: common.GridCellData, columnIndex: number) {
        this.resizingCell = cell;
        e.stopPropagation();
        this.initialClientX = e.clientX;
        this.initialWidth = (e.target as HTMLElement).parentElement!.getClientRects()[0].width;
        this.initialRowWidth = (e.target as HTMLElement).parentElement!.parentElement!.getClientRects()[0].width;
        this.resizingIndex = columnIndex;
    }
    resizeEnd() {
        this.resizingCell = null;
    }
    mousemove(e: React.MouseEvent<HTMLDivElement>) {
        if (this.resizingCell) {
            e.preventDefault();
            const cellWidth = this.initialWidth + e.clientX - this.initialClientX;
            const rowWidth = this.initialRowWidth + e.clientX - this.initialClientX;
            this.resizingCell.width = cellWidth;
            this.props.data.headers.width = rowWidth;
            for (const row of this.props.data.rows) {
                row.width = rowWidth;
                row.cells[this.resizingIndex!].width = cellWidth;
            }
            this.forceUpdate();
            this.canSort = false;
        }
    }
    getStyle(width: number | undefined) {
        return width ? { width } : {};
    }

    componentDidMount() {
        this.heads = ReactDOM.findDOMNode(this).childNodes[1].childNodes[0] as HTMLElement;
        this.container = ReactDOM.findDOMNode(this).childNodes[1].childNodes[1] as HTMLElement;
        if (ReactDOM.findDOMNode(this).childNodes[0].childNodes.length > 1) {
            this.leftContainer = ReactDOM.findDOMNode(this).childNodes[0].childNodes[1] as HTMLElement;
        }
        if (ReactDOM.findDOMNode(this).childNodes[2].childNodes.length > 1) {
            this.rightContainer = ReactDOM.findDOMNode(this).childNodes[2].childNodes[1] as HTMLElement;
        }

        common.Ps.initialize(this.container);

        this.container.addEventListener("ps-scroll-y", e => common.handleScrollYEvent(e, this.leftContainer, this.rightContainer));
        this.container.addEventListener("ps-scroll-x", e => common.handleScrollXEvent(e, this.heads));

        if (this.leftContainer) {
            this.leftContainer.addEventListener("mousewheel", e => common.updateVerticalScroll(e, this.container));
        }
        if (this.rightContainer) {
            this.rightContainer.addEventListener("mousewheel", e => common.updateVerticalScroll(e, this.container));
        }
        this.heads.addEventListener("mousewheel", e => common.updateHorizontalScroll(e, this.container));
    }
    componentWillUnmount() {
        if (this.container) {
            common.Ps.destroy(this.container);

            this.container.removeEventListener("ps-scroll-x");
            this.container.removeEventListener("ps-scroll-y");

            if (this.leftContainer) {
                this.leftContainer.removeEventListener("mousewheel");
            }
            if (this.rightContainer) {
                this.rightContainer.removeEventListener("mousewheel");
            }
            this.heads.removeEventListener("mousewheel");
        }
    }

    render() {
        let mainHead: JSX.Element | null = null;
        if (this.props.data.headers && this.props.data.headers.cells) {
            const headCells = this.props.data.headers.cells.map((cell, columnIndex) => {
                const headCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number; action: (actionData: common.ActionData) => void }>, {
                    data: cell.value,
                    action: (actionData: any) => this.action({ cell, header: this.props.data.headers, columnIndex, data: actionData }),
                }) : cell.value;
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
                const divider = this.props.resize ? (<div className="divider" onMouseDown={e => this.resizeStart(e, cell, columnIndex)}></div>) : null;
                return (
                    <th className={"grid-main-head-row-cell " + (cell.style || "")}
                        style={this.getStyle(cell.width)}
                        onClick={e => this.sort({ cell, header: this.props.data.headers, columnIndex })}>
                        {ascMarker}
                        {descMarker}
                        {headCell}
                        {divider}
                    </th>
                );
            });
            mainHead = (
                <thead className="grid-main-head">
                    <tr className={"grid-main-head-row " + (this.props.data.headers.style || "")}
                        style={this.getStyle(this.props.data.headers.width)}>
                        {headCells}
                    </tr>
                </thead>
            );
        }

        let leftHead: JSX.Element | null = null;
        if (this.props.data.leftHeaders && this.props.data.leftHeaders.cells) {
            const headCells = this.props.data.leftHeaders.cells.map((cell, columnIndex) => {
                const headCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number; action: (actionData: any) => void }>, {
                    data: cell.value,
                    action: (actionData: any) => this.action({ cell, header: this.props.data.leftHeaders!, columnIndex, data: actionData }),
                }) : cell.value;
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
                        onClick={e => this.sort({ cell, header: this.props.data.leftHeaders!, columnIndex })}>
                        {ascMarker}
                        {descMarker}
                        {headCell}
                    </th>
                );
            });
            leftHead = (
                <thead className="grid-left-head">
                    <tr className={"grid-left-head-row " + (this.props.data.leftHeaders.style || "")}>
                        {headCells}
                    </tr>
                </thead>
            );
        }

        let rightHead: JSX.Element | null = null;
        if (this.props.data.rightHeaders && this.props.data.rightHeaders.cells) {
            const headCells = this.props.data.rightHeaders.cells.map((cell, columnIndex) => {
                const headCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number; action: (actionData: any) => void }>, {
                    data: cell.value,
                    action: (actionData: any) => this.action({ cell, header: this.props.data.rightHeaders!, columnIndex, data: actionData }),
                }) : cell.value;
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
                        onClick={e => this.sort({ cell, header: this.props.data.rightHeaders!, columnIndex })}>
                        {ascMarker}
                        {descMarker}
                        {headCell}
                    </th>
                );
            });
            rightHead = (
                <thead className="grid-right-head">
                    <tr className={"grid-right-head-row " + (this.props.data.rightHeaders.style || "")}>
                        {headCells}
                    </tr>
                </thead>
            );
        }

        const mainBody = this.props.data.rows.map((row, rowIndex) => {
            const cells = row.cells.map((cell, columnIndex) => {
                const bodyCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number; action: (actionData: any) => void }>, {
                    data: cell.value,
                    action: (actionData: any) => this.action({ cell, row, body: this.props.data.rows, rowIndex, columnIndex, data: actionData }),
                }) : cell.value;
                return (
                    <td className={"grid-main-body-row-cell " + (cell.style || "")}
                        style={this.getStyle(cell.width)}
                        onClick={() => this.click({ cell, row, body: this.props.data.rows, rowIndex, columnIndex })}>
                        {bodyCell}
                    </td>
                );
            });
            return (
                <tr className={"grid-main-body-row " + (row.style || "")}
                    style={this.getStyle(row.width)}>
                    {cells}
                </tr>
            );
        });
        let leftBody: JSX.Element | null = null;
        if (this.props.data.leftRows) {
            const leftBodyRows = this.props.data.leftRows.map((row, rowIndex) => {
                const cells = row.cells.map((cell, columnIndex) => {
                    const bodyCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number; action: (actionData: any) => void }>, {
                        data: cell.value,
                        action: (actionData: any) => this.action({ cell, row, body: this.props.data.leftRows!, rowIndex, columnIndex, data: actionData }),
                    }) : cell.value;
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
            });
            leftBody = (
                <tbody className="grid-left-body">
                    {leftBodyRows}
                </tbody>
            );
        }
        let rightBody: JSX.Element | null = null;
        if (this.props.data.rightRows) {
            const rightBodyRows = this.props.data.rightRows.map((row, rowIndex) => {
                const cells = row.cells.map((cell, columnIndex) => {
                    const bodyCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number; action: (actionData: any) => void }>, {
                        data: cell.value,
                        action: (actionData: any) => this.action({ cell, row, body: this.props.data.rightRows!, rowIndex, columnIndex, data: actionData }),
                    }) : cell.value;
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
            });
            rightBody = (
                <tbody className="grid-right-body">
                    {rightBodyRows}
                </tbody>
            );
        }

        return (
            <div className="grid" onMouseUp={e => this.resizeEnd()} onMouseMove={e => this.mousemove(e)}>
                <table className="grid-left">
                    {leftHead}
                    {leftBody}
                </table>
                <table className="grid-main">
                    {mainHead}
                    <tbody className="grid-main-body">
                        {mainBody}
                    </tbody>
                </table>
                <table className="grid-right">
                    {rightHead}
                    {rightBody}
                </table>
            </div>
        );
    }
}
