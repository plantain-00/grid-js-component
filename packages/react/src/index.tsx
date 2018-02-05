import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as common from 'grid-js-component'
export * from 'grid-js-component'

/**
 * @public
 */
export class Grid extends React.Component<{
  data: common.GridData;
  resize?: boolean;
  sort: (sortData: common.SortData) => void;
  click: (clickData: common.ClickData) => void;
  action: (actionData: common.ActionData) => void;
  resized: (resizeData: common.ResizeData) => void;
}, {}> {
  private container!: HTMLElement
  private heads!: HTMLElement
  private leftContainer?: HTMLElement
  private rightContainer?: HTMLElement

  private resizingCell: common.GridCellData | null = null
  private initialClientX!: number
  private initialWidth!: number
  private initialRowWidth!: number
  private resizingIndex: number | null = null
  private canSort = true
  private ps!: common.Ps | null

  componentDidMount () {
    this.heads = ReactDOM.findDOMNode(this as any).childNodes[1].childNodes[0] as HTMLElement
    this.container = ReactDOM.findDOMNode(this as any).childNodes[1].childNodes[1] as HTMLElement
    if (ReactDOM.findDOMNode(this as any).childNodes[0].childNodes.length > 1) {
      this.leftContainer = ReactDOM.findDOMNode(this as any).childNodes[0].childNodes[1] as HTMLElement
    }
    if (ReactDOM.findDOMNode(this as any).childNodes[2].childNodes.length > 1) {
      this.rightContainer = ReactDOM.findDOMNode(this as any).childNodes[2].childNodes[1] as HTMLElement
    }

    this.ps = new common.Ps(this.container)

    this.container.addEventListener('ps-scroll-y', this.handlePsScrollY)
    this.container.addEventListener('ps-scroll-x', this.handlePsScrollX)
    this.container.addEventListener('ps-x-reach-start', this.handlePsXReachStart)
    this.container.addEventListener('ps-x-reach-end', this.handlePsXReachEnd)
    this.container.addEventListener('ps-y-reach-start', this.handlePsYReachStart)
    this.container.addEventListener('ps-y-reach-end', this.handlePsYReachEnd)

    if (this.leftContainer) {
      this.leftContainer.addEventListener('wheel', this.handleWheel)
    }
    if (this.rightContainer) {
      this.rightContainer.addEventListener('wheel', this.handleWheel)
    }
    this.heads.addEventListener('wheel', this.handleWheelForHead)
  }
  componentWillUnmount () {
    if (this.container && this.ps) {
      this.ps.destroy()
      this.ps = null

      this.container.removeEventListener('ps-scroll-x', this.handlePsScrollX)
      this.container.removeEventListener('ps-scroll-y', this.handlePsScrollY)
      this.container.removeEventListener('ps-x-reach-start', this.handlePsXReachStart)
      this.container.removeEventListener('ps-x-reach-end', this.handlePsXReachEnd)
      this.container.removeEventListener('ps-y-reach-start', this.handlePsYReachStart)
      this.container.removeEventListener('ps-y-reach-end', this.handlePsYReachEnd)

      if (this.leftContainer) {
        this.leftContainer.removeEventListener('wheel', this.handleWheel)
      }
      if (this.rightContainer) {
        this.rightContainer.removeEventListener('wheel', this.handleWheel)
      }
      this.heads.removeEventListener('wheel', this.handleWheelForHead)
    }
  }

  render () {
    let mainHead: JSX.Element | null = null
    if (this.props.data.headers && this.props.data.headers.cells) {
      const headCells = this.props.data.headers.cells.map((cell, columnIndex) => {
        const headCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number; action: (actionData: common.ActionData) => void }>, {
          data: cell.value,
          action: (actionData: any) => this.action({ cell, header: this.props.data.headers, columnIndex, data: actionData })
        }) : cell.value
        const ascMarker = this.isAsc(cell.value) ? (
          <svg width='10' height='10'>
            <polygon points='0,10 5,0 10,10'></polygon>
          </svg>
        ) : null
        const descMarker = this.isDesc(cell.value) ? (
          <svg width='10' height='10'>
            <polygon points='0,0 5,10 10,0'></polygon>
          </svg>
        ) : null
        const divider = this.props.resize ? (<div className='divider' onMouseDown={e => this.resizeStart(e, cell, columnIndex)}></div>) : null
        return (
          <th className={'grid-main-head-row-cell ' + (cell.style || '')}
            key={columnIndex}
            style={this.getStyle(cell.width)}
            onClick={e => this.sort({ cell, header: this.props.data.headers, columnIndex })}>
            {ascMarker}
            {descMarker}
            {headCell}
            {divider}
          </th>
        )
      })
      mainHead = (
        <thead className='grid-main-head'>
          <tr className={'grid-main-head-row ' + (this.props.data.headers.style || '')}
            style={this.getStyle(this.props.data.headers.width)}>
            {headCells}
          </tr>
        </thead>
      )
    }

    let leftHead: JSX.Element | null = null
    if (this.props.data.leftHeaders && this.props.data.leftHeaders.cells) {
      const headCells = this.props.data.leftHeaders.cells.map((cell, columnIndex) => {
        const headCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number; action: (actionData: any) => void }>, {
          data: cell.value,
          action: (actionData: any) => this.action({ cell, header: this.props.data.leftHeaders!, columnIndex, data: actionData })
        }) : cell.value
        const ascMarker = this.isAsc(cell.value) ? (
          <svg width='10' height='10'>
            <polygon points='0,10 5,0 10,10'></polygon>
          </svg>
        ) : null
        const descMarker = this.isDesc(cell.value) ? (
          <svg width='10' height='10'>
            <polygon points='0,0 5,10 10,0'></polygon>
          </svg>
        ) : null
        return (
          <th className={'grid-left-head-row-cell ' + (cell.style || '')}
            key={columnIndex}
            onClick={e => this.sort({ cell, header: this.props.data.leftHeaders!, columnIndex })}>
            {ascMarker}
            {descMarker}
            {headCell}
          </th>
        )
      })
      leftHead = (
        <thead className='grid-left-head'>
          <tr className={'grid-left-head-row ' + (this.props.data.leftHeaders.style || '')}>
            {headCells}
          </tr>
        </thead>
      )
    }

    let rightHead: JSX.Element | null = null
    if (this.props.data.rightHeaders && this.props.data.rightHeaders.cells) {
      const headCells = this.props.data.rightHeaders.cells.map((cell, columnIndex) => {
        const headCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number; action: (actionData: any) => void }>, {
          data: cell.value,
          action: (actionData: any) => this.action({ cell, header: this.props.data.rightHeaders!, columnIndex, data: actionData })
        }) : cell.value
        const ascMarker = this.isAsc(cell.value) ? (
          <svg width='10' height='10'>
            <polygon points='0,10 5,0 10,10'></polygon>
          </svg>
        ) : null
        const descMarker = this.isDesc(cell.value) ? (
          <svg width='10' height='10'>
            <polygon points='0,0 5,10 10,0'></polygon>
          </svg>
        ) : null
        return (
          <th className={'grid-right-head-row-cell ' + (cell.style || '')}
            key={columnIndex}
            onClick={e => this.sort({ cell, header: this.props.data.rightHeaders!, columnIndex })}>
            {ascMarker}
            {descMarker}
            {headCell}
          </th>
        )
      })
      rightHead = (
        <thead className='grid-right-head'>
          <tr className={'grid-right-head-row ' + (this.props.data.rightHeaders.style || '')}>
            {headCells}
          </tr>
        </thead>
      )
    }

    const mainBody = this.props.data.rows.map((row, rowIndex) => {
      const cells = row.cells.map((cell, columnIndex) => {
        const bodyCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number; action: (actionData: any) => void }>, {
          data: cell.value,
          action: (actionData: any) => this.action({ cell, row, body: this.props.data.rows, rowIndex, columnIndex, data: actionData })
        }) : cell.value
        return (
          <td className={'grid-main-body-row-cell ' + (cell.style || '')}
            key={columnIndex}
            style={this.getStyle(cell.width)}
            onClick={() => this.click({ cell, row, body: this.props.data.rows, rowIndex, columnIndex })}>
            {bodyCell}
          </td>
        )
      })
      return (
        <tr className={'grid-main-body-row ' + (row.style || '')}
          key={rowIndex}
          style={this.getStyle(row.width)}>
          {cells}
        </tr>
      )
    })
    let leftBody: JSX.Element | null = null
    if (this.props.data.leftRows) {
      const leftBodyRows = this.props.data.leftRows.map((row, rowIndex) => {
        const cells = row.cells.map((cell, columnIndex) => {
          const bodyCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number; action: (actionData: any) => void }>, {
            data: cell.value,
            action: (actionData: any) => this.action({ cell, row, body: this.props.data.leftRows!, rowIndex, columnIndex, data: actionData })
          }) : cell.value
          return (
            <td className={'grid-left-body-row-cell ' + (cell.style || '')}
              key={columnIndex}
              onClick={() => this.click({ cell, row, body: this.props.data.leftRows!, rowIndex, columnIndex })}>
              {bodyCell}
            </td>
          )
        })
        return (
          <tr className={'grid-left-body-row ' + (row.style || '')} key={rowIndex}>
            {cells}
          </tr>
        )
      })
      leftBody = (
        <tbody className='grid-left-body'>
          {leftBodyRows}
        </tbody>
      )
    }
    let rightBody: JSX.Element | null = null
    if (this.props.data.rightRows) {
      const rightBodyRows = this.props.data.rightRows.map((row, rowIndex) => {
        const cells = row.cells.map((cell, columnIndex) => {
          const bodyCell = cell.component ? React.createElement(cell.component as React.ComponentClass<{ data: number; action: (actionData: any) => void }>, {
            data: cell.value,
            action: (actionData: any) => this.action({ cell, row, body: this.props.data.rightRows!, rowIndex, columnIndex, data: actionData })
          }) : cell.value
          return (
            <td className={'grid-right-body-row-cell ' + (cell.style || '')}
              key={columnIndex}
              onClick={() => this.click({ cell, row, body: this.props.data.rightRows!, rowIndex, columnIndex })}>
              {bodyCell}
            </td>
          )
        })
        return (
          <tr className={'grid-right-body-row ' + (row.style || '')} key={rowIndex}>
            {cells}
          </tr>
        )
      })
      rightBody = (
        <tbody className='grid-right-body'>
          {rightBodyRows}
        </tbody>
      )
    }

    return (
      <div className='grid' onMouseUp={e => this.resizeEnd(e)} onMouseMove={e => this.mousemove(e)}>
        <table className='grid-left'>
          {leftHead}
          {leftBody}
        </table>
        <table className='grid-main'>
          {mainHead}
          <tbody className='grid-main-body'>
            {mainBody}
          </tbody>
        </table>
        <table className='grid-right'>
          {rightHead}
          {rightBody}
        </table>
      </div>
    )
  }

  private handlePsScrollY = (e: Event) => common.handleScrollYEvent((e.target as HTMLElement).scrollTop, this.leftContainer, this.rightContainer)
  private handlePsScrollX = (e: Event) => common.handleScrollXEvent((e.target as HTMLElement).scrollLeft, this.heads)
  private handlePsXReachStart = (e: Event) => common.handleScrollXEvent(0, this.heads)
  private handlePsXReachEnd = (e: Event) => common.handleScrollXEvent(this.container.scrollLeft, this.heads)
  private handlePsYReachStart = (e: Event) => common.handleScrollYEvent(0, this.leftContainer, this.rightContainer)
  private handlePsYReachEnd = (e: Event) => common.handleScrollYEvent(this.container.scrollTop, this.leftContainer, this.rightContainer)
  private handleWheel = (e: WheelEvent) => common.updateVerticalScroll(e, this.container, this.ps, this.leftContainer, this.rightContainer)
  private handleWheelForHead = (e: WheelEvent) => common.updateHorizontalScroll(e, this.container, this.ps)

  private sort (sortData: common.SortData) {
    if (this.canSort) {
      this.props.sort(sortData)
    } else {
      this.canSort = true
    }
  }

  private isAsc (column: string) {
    return this.props.data.sortType === 'asc' && this.props.data.sortColumn !== '' && this.props.data.sortColumn === column
  }
  private isDesc (column: string) {
    return this.props.data.sortType === 'desc' && this.props.data.sortColumn !== '' && this.props.data.sortColumn === column
  }

  private click (clickData: common.ClickData) {
    this.props.click(clickData)
  }

  private action (actionData: common.ActionData) {
    this.props.action(actionData)
  }

  private resizeStart (e: React.MouseEvent<HTMLDivElement>, cell: common.GridCellData, columnIndex: number) {
    this.resizingCell = cell
    e.stopPropagation()
    this.initialClientX = e.clientX
    this.initialWidth = (e.target as HTMLElement).parentElement!.getClientRects()[0].width
    this.initialRowWidth = (e.target as HTMLElement).parentElement!.parentElement!.getClientRects()[0].width
    this.resizingIndex = columnIndex
  }
  private resizeEnd (e: React.MouseEvent<HTMLDivElement>) {
    this.resizingCell = null

    if (!this.canSort) {
      const cellWidth = this.initialWidth + e.clientX - this.initialClientX
      const rowWidth = this.initialRowWidth + e.clientX - this.initialClientX
      const resizeData: common.ResizeData = {
        cellWidth,
        rowWidth,
        index: this.resizingIndex!
      }
      this.props.resized(resizeData)
    }
  }
  private mousemove (e: React.MouseEvent<HTMLDivElement>) {
    if (this.resizingCell) {
      e.preventDefault()
      const cellWidth = this.initialWidth + e.clientX - this.initialClientX
      const rowWidth = this.initialRowWidth + e.clientX - this.initialClientX
      this.resizingCell.width = cellWidth
      this.props.data.headers.width = rowWidth
      for (const row of this.props.data.rows) {
        row.width = rowWidth
        row.cells[this.resizingIndex!].width = cellWidth
      }
      this.forceUpdate()
      this.canSort = false
    }
  }
  private getStyle (width: number | undefined) {
    return width ? { width } : {}
  }
}
