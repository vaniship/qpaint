import { Point, QShapeStyle, HitResult, fill } from './shape'
import QShapeBase from './Base'

class QEllipse extends QShapeBase {
  constructor(id: string,
    private x: number,
    private y: number,
    private radiusX: number,
    private radiusY: number,
    public style: QShapeStyle
  ) {
    super(id, style)
  }

  bound() {
    return {
      x: this.x - this.radiusX,
      y: this.y - this.radiusY,
      width: this.radiusX * 2,
      height: this.radiusY * 2
    }
  }

  hitTest(pt: Point): HitResult {
    let dx = pt.x - this.x
    let dy = pt.y - this.y
    let a = this.radiusX
    let b = this.radiusY
    if (dx * dx / a / a + dy * dy / b / b <= 1) {
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
    ctx.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI)
    fill(ctx, style.fillColor)
    ctx.stroke()
  }
}

export default QEllipse
