import QShapeCreator from '../creator/shapecreator'
import QPaintView from '../view'
import { RectByPoint, normalizeRect } from '../dom/shape'
import QLine from '../dom/line'
import QEllipse from '../dom/ellipse'
import QRect from '../dom/rect'

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

  buildShape() {
    let rect = this.rect
    let r = normalizeRect(rect)
    let style = this.qview.style.clone()
    switch (this.shapeType) {
      case "line":
        return new QLine(rect.pt1, rect.pt2, style)
      case "rect":
        return new QRect(r, style)
      case "ellipse":
        let rx = r.width / 2
        let ry = r.height / 2
        return new QEllipse(r.x + rx, r.y + ry, rx, ry, style)
      case "circle":
        let rc = Math.sqrt(r.width * r.width + r.height * r.height)
        return new QEllipse(rect.pt1.x, rect.pt1.y, rc, rc, style)
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
      this.buildShape()!.onpaint(ctx)
    }
  }
}

export default QRectCreator
