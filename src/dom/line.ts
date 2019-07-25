import { Point, QShapeBase, QShapeStyle, HitResult, hitLine, normalizeRect } from './shape'

class QLine extends QShapeBase {
  private pt1: Point
  private pt2: Point

  constructor(point1: Point, point2: Point, public style: QShapeStyle) {
    super(style)
    this.pt1 = point1
    this.pt2 = point2
  }

  bound() {
    return normalizeRect({pt1: this.pt1, pt2: this.pt2})
  }

  hitTest(pt: Point): HitResult {
    if (hitLine(pt, this.pt1, this.pt2, this.style.lineWidth)) {
      return { hitCode: 1, hitShape: this }
    }
    return { hitCode: 0, hitShape: null }
  }

  move(dx: number, dy: number) {
    this.pt1.x += dx
    this.pt1.y += dy
    this.pt2.x += dx
    this.pt2.y += dy
  }

  onpaint(ctx: CanvasRenderingContext2D) {
    let style = this.style
    ctx.lineWidth = style.lineWidth
    ctx.strokeStyle = style.lineColor
    ctx.beginPath()
    ctx.moveTo(this.pt1.x, this.pt1.y)
    ctx.lineTo(this.pt2.x, this.pt2.y)
    ctx.stroke()
  }
}

export default QLine
