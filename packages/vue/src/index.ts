import Vue from 'vue'
import Component from 'vue-class-component'
import * as common from 'grid-js-component'
export * from 'grid-js-component'
import { indexTemplateHtml, indexTemplateHtmlStatic } from './variables'

@Component({
  render: indexTemplateHtml,
  staticRenderFns: indexTemplateHtmlStatic,
  props: ['data', 'resize']
})
export class Grid extends Vue {
  data: common.GridData
  resize?: boolean

  private container: HTMLElement
  private heads: HTMLElement
  private leftContainer?: HTMLElement
  private rightContainer?: HTMLElement

  private resizingCell: common.GridCellData | null = null
  private initialClientX: number
  private initialWidth: number
  private initialRowWidth: number
  private resizingIndex: number | null = null
  private canSort = true
  private ps: common.Ps | null

  sort (sortData: common.SortData) {
    if (this.canSort) {
      this.$emit('sort', sortData)
    } else {
      this.canSort = true
    }
  }

  isAsc (column: string) {
    return this.data.sortType === 'asc' && this.data.sortColumn !== '' && this.data.sortColumn === column
  }
  isDesc (column: string) {
    return this.data.sortType === 'desc' && this.data.sortColumn !== '' && this.data.sortColumn === column
  }

  click (clickData: common.ClickData) {
    this.$emit('click', clickData)
  }

  action (actionData: common.ActionData) {
    this.$emit('action', actionData)
  }

  resizeStart (e: MouseEvent, cell: common.GridCellData, columnIndex: number) {
    this.resizingCell = cell
    e.stopPropagation()
    e.stopImmediatePropagation()
    this.initialClientX = e.clientX
    this.initialWidth = (e.target as HTMLElement).parentElement!.getClientRects()[0].width
    this.initialRowWidth = (e.target as HTMLElement).parentElement!.parentElement!.getClientRects()[0].width
    this.resizingIndex = columnIndex
  }
  resizeEnd (e: MouseEvent) {
    this.resizingCell = null

    if (!this.canSort) {
      const cellWidth = this.initialWidth + e.clientX - this.initialClientX
      const rowWidth = this.initialRowWidth + e.clientX - this.initialClientX
      const resizeData: common.ResizeData = {
        cellWidth,
        rowWidth,
        index: this.resizingIndex!
      }
      this.$emit('resized', resizeData)
    }
  }
  mousemove (e: MouseEvent) {
    if (this.resizingCell) {
      e.preventDefault()
      const cellWidth = this.initialWidth + e.clientX - this.initialClientX
      const rowWidth = this.initialRowWidth + e.clientX - this.initialClientX
      this.resizingCell.width = cellWidth
      this.data.headers.width = rowWidth
      for (const row of this.data.rows) {
        row.width = rowWidth
        row.cells[this.resizingIndex!].width = cellWidth
      }
      this.canSort = false
    }
  }
  getStyle (width: number | undefined) {
    return width ? { width } : {}
  }

  mounted () {
    this.heads = this.$el.childNodes[1].childNodes[0] as HTMLElement
    this.container = this.$el.childNodes[1].childNodes[1] as HTMLElement
    if (this.$el.childNodes[0].childNodes.length > 1) {
      this.leftContainer = this.$el.childNodes[0].childNodes[1] as HTMLElement
    }
    if (this.$el.childNodes[2].childNodes.length > 1) {
      this.rightContainer = this.$el.childNodes[2].childNodes[1] as HTMLElement
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
  beforeDestroy () {
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

  private handlePsScrollY (e: Event) {
    common.handleScrollYEvent((e.target as HTMLElement).scrollTop, this.leftContainer, this.rightContainer)
  }
  private handlePsScrollX (e: Event) {
    common.handleScrollXEvent((e.target as HTMLElement).scrollLeft, this.heads)
  }
  private handlePsXReachStart (e: Event) {
    common.handleScrollXEvent(0, this.heads)
  }
  private handlePsXReachEnd (e: Event) {
    common.handleScrollXEvent(this.container.scrollLeft, this.heads)
  }
  private handlePsYReachStart (e: Event) {
    common.handleScrollYEvent(0, this.leftContainer, this.rightContainer)
  }
  private handlePsYReachEnd (e: Event) {
    common.handleScrollYEvent(this.container.scrollTop, this.leftContainer, this.rightContainer)
  }
  private handleWheel (e: WheelEvent) {
    common.updateVerticalScroll(e, this.container, this.ps, this.leftContainer, this.rightContainer)
  }
  private handleWheelForHead (e: WheelEvent) {
    common.updateHorizontalScroll(e, this.container, this.ps)
  }
}

Vue.component('grid', Grid)
