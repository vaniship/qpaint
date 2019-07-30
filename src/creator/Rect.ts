import QShapeCreator from './ShapeCreator'
import QPaintView from '../View'
import { RectByPoint, normalizeRect } from '../dom/shape'
import QLine from '../dom/Line'
import QEllipse from '../dom/Ellipse'
import QRect from '../dom/Rect'

class QRectCreator extends QShapeCreator {
  private rect: RectByPoint = {
    pt1: { x: 0, y: 0 },
    pt2: { x: 0, y: 0 }
  }

  constructor(protected qview: QPaintView, public shapeType: string) {
    super(qview)
  }

  reset() {
    super.reset()
    this.qview.invalidate(this.rect)
  }

  buildShape(temp = false) {
    let rect = this.rect
    let r = normalizeRect(rect)
    let style = this.qview.style.clone()
    const id = temp ? '~' : this.getNextShapeId()
    switch (this.shapeType) {
      case "line":
        return new QLine(id, rect.pt1, rect.pt2, style)
      case "rect":
        return new QRect(id, r, style)
      case "ellipse":
        let rx = r.width / 2
        let ry = r.height / 2
        return new QEllipse(id, r.x + rx, r.y + ry, rx, ry, style)
      case "circle":
        let rc = Math.sqrt(r.width * r.width + r.height * r.height)
        return new QEllipse(id, rect.pt1.x, rect.pt1.y, rc, rc, style)
      default:
        alert("unknown shapeType: " + this.shapeType)
        return null
    }
  }

  ondblclick(_: MouseEvent) {}

  onmousedown(event: MouseEvent) {
    this.rect.pt1 = this.qview.getMousePos(event)
    this.started = true
  }

  onmousemove(event: MouseEvent) {
    if (this.started) {
      this.rect.pt2 = this.qview.getMousePos(event)
      this.qview.invalidate(this.rect)
    }
  }

  onmouseup(event: MouseEvent) {
    if (this.started) {
      this.rect.pt2 = this.qview.getMousePos(event)
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
      this.buildShape(true)!.onpaint(ctx)
    }
  }
}

export default QRectCreator
