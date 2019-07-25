import QController from '../controller'
import QPaintView from '../view'
import { Point } from '../dom/shape'

class QShapeSelector implements QController{
  private started: boolean = false
  private pt: Point = { x: 0, y: 0 }
  private ptMove: Point = { x: 0, y: 0 }

  constructor(private qview: QPaintView) {}

  stop() {}

  reset() {
    this.started = false
    this.qview.invalidate(null)
  }

  ondblclick(event: MouseEvent) {}

  onmousedown(event: MouseEvent) {
    this.pt = this.ptMove = this.qview.getMousePos(event)
    this.started = true
    let ht = this.qview.doc.hitTest(this.pt)
    if (this.qview.selection != ht.hitShape) {
      this.qview.selection = ht.hitShape
      this.qview.invalidate(null)
    }
  }

  onmousemove(event: MouseEvent) {
    let pt = this.qview.getMousePos(event)
    if (this.started) {
      this.ptMove = pt
      this.qview.invalidate(null)
    } else {
      let ht = this.qview.doc.hitTest(pt)
      if (ht.hitCode > 0) {
        this.qview.drawing.style.cursor = "move"
      } else {
        this.qview.drawing.style.cursor = "auto"
      }
    }
  }

  onmouseup(event: MouseEvent) {
    if (this.started) {
      let selection = this.qview.selection
      if (selection != null) {
        let pt = this.qview.getMousePos(event)
        selection.move(pt.x - this.pt.x, pt.y - this.pt.y)
      }
      this.reset()
    }
  }

  onkeydown(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 8:  // keyBackSpace
      case 46: // keyDelete
        this.qview.doc.deleteShape(this.qview.selection)
        this.qview.selection = null
      case 27: // keyEsc
        this.reset()
        break
    }
  }

  onpaint(ctx: CanvasRenderingContext2D) {
    let selection = this.qview.selection
    if (selection != null) {
      let bound = selection.bound()
      if (this.started) {
        bound.x += this.ptMove.x - this.pt.x
        bound.y += this.ptMove.y - this.pt.y
      }
      ctx.lineWidth = 1
      ctx.strokeStyle = "gray"
      ctx.beginPath()
      ctx.setLineDash([5, 5])
      ctx.rect(bound.x, bound.y, bound.width, bound.height)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }
}

export default QShapeSelector
