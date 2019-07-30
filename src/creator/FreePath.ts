import QShapeCreator from './ShapeCreator'
import QPath from '../dom/Path'
import { Point } from '../dom/shape'

class QFreePathCreator extends QShapeCreator {
  private points: Array<Point> = []
  private fromPos: Point = { x: 0, y: 0 }
  private close: boolean = false

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

  ondblclick(_: MouseEvent) {}

  onmousedown(event: MouseEvent) {
    this.fromPos = this.qview.getMousePos(event)
    this.started = true
  }

  onmousemove(event: MouseEvent) {
    if (this.started) {
      this.points.push(this.qview.getMousePos(event))
      this.qview.invalidate(null)
    }
  }

  onmouseup(_: MouseEvent) {
    if (this.started) {
      this.qview.doc.addShape(this.buildShape())
      this.reset()
    }
  }

  onkeydown(event: KeyboardEvent) {
    if (event.keyCode == 27) { // keyEsc
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
      ctx.stroke()
    }
  }
}

export default QFreePathCreator
