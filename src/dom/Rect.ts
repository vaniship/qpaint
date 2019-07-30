import { Point, Rect, QShapeStyle, HitResult, hitRect, fill } from './shape'
import QShapeBase from './Base'

class QRect extends QShapeBase {
  private x: number
  private y: number
  private width: number
  private height: number

  constructor(id: string, r: Rect, public style: QShapeStyle) {
    super(id, style)
    this.x = r.x
    this.y = r.y
    this.width = r.width
    this.height = r.height
  }

  bound() {
    return { x: this.x, y: this.y, width: this.width, height: this.height }
  }

  hitTest(pt: Point): HitResult {
    if (hitRect(pt, this.bound())) {
      return { hitCode: 1, hitShape: this }
    }
    return { hitCode: 0, hitShape: null }
  }

  move(dx: number, dy: number) {
    this.x += dx
    this.y += dy
  }

  onpaint(ctx: CanvasRenderingContext2D) {
    let style = this.style
    ctx.lineWidth = style.lineWidth
    ctx.strokeStyle = style.lineColor
    ctx.beginPath()
    ctx.rect(this.x, this.y, this.width, this.height)
    fill(ctx, style.fillColor)
    ctx.stroke()
  }
}

export default QRect
