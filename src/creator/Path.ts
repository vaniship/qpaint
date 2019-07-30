import QShapeCreator from './ShapeCreator'
import QPaintView from '../View'
import QPath from '../dom/Path'
import { Point } from '../dom/shape'

class QPathCreator extends QShapeCreator {
  private points: Array<Point> = []
  private fromPos: Point = { x: 0, y: 0 }
  private toPos: Point = { x: 0, y: 0 }

  constructor(protected qview: QPaintView, public close: boolean) {
    super(qview)
  }

  reset() {
    super.reset()
    this.points = []
    this.qview.invalidate(null)
  }

  buildShape() {
    let points = [{ x: this.fromPos.x, y: this.fromPos.y }]
    for (let i in this.points) {
      points.push(this.points[i])
    }
    return new QPath(this.getNextShapeId(), points, this.close, this.qview.style.clone())
  }

  onmouseup(_: MouseEvent) {}

  onmousedown(event: MouseEvent) {
    this.toPos = this.qview.getMousePos(event)
    if (this.started) {
      this.points.push(this.toPos)
    } else {
      this.fromPos = this.toPos
      this.started = true
    }
    this.qview.invalidate(null)
  }

  onmousemove(event: MouseEvent) {
    if (this.started) {
      this.toPos = this.qview.getMousePos(event)
      this.qview.invalidate(null)
    }
  }

  ondblclick() {
    if (this.started) {
      this.qview.doc.addShape(this.buildShape())
      this.reset()
    }
  }

  onkeydown(event: KeyboardEvent) {
    switch (event.keyCode) {
      case 13: // keyEnter
        const n = this.points.length
        if (n == 0 || this.points[n-1] !== this.toPos) {
          this.points.push(this.toPos)
        }
        this.ondblclick()
        break
      case 27: // keyEsc
        this.reset()
    }
  }

  onpaint(ctx: CanvasRenderingContext2D) {
    if (this.started) {
      let props = this.qview.style
      ctx.lineWidth = props.lineWidth
      ctx.strokeStyle = props.lineColor
      ctx.beginPath()
      ctx.moveTo(this.fromPos.x, this.fromPos.y)
      for (let i in this.points) {
        ctx.lineTo(this.points[i].x, this.points[i].y)
      }
      ctx.lineTo(this.toPos.x, this.toPos.y)
      if (this.close) {
        ctx.closePath()
      }
      ctx.stroke()
    }
  }
}

export default QPathCreator
