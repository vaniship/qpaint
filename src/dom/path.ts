import { Point, Rect, QShapeBase, QShapeStyle, HitResult, hitLine, hitRect } from './shape'

class QPath extends QShapeBase {
  constructor(private points: Array<Point>, private close: boolean, public style: QShapeStyle) {
    super(style)
  }

  bound(): Rect {
    let points = this.points
    let n = points.length
    if (n < 1) {
      return { x: 0, y: 0, width: 0, height: 0 }
    }
    let x1 = points[0].x
    let y1 = points[0].y
    let x2 = x1
    let y2 = y1
    for (let i = 1; i < n; i++) {
      let tx = points[i].x
      let ty = points[i].y
      if (tx < x1) {
        x1 = tx
      } else if (tx > x2) {
        x2 = tx
      }
      if (ty < y1) {
        y1 = ty
      } else if (ty > y2) {
        y2 = ty
      }
    }
    return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 }
  }

  hitTest(pt: Point): HitResult {
    if (hitRect(pt, this.bound())) {
      let points = this.points
      let n = points.length
      if (n > 1) {
        let lineWidth = this.style.lineWidth
        for (let i = 1; i < n; i++) {
          if (hitLine(pt, points[i - 1], points[i], lineWidth)) {
            return { hitCode: 1, hitShape: this }
          }
        }
      }
    }
    return { hitCode: 0, hitShape: null }
  }

  move(dx: number, dy: number) {
    let points = this.points
    for (let i in points) {
      points[i].x += dx
      points[i].y += dy
    }
  }

  onpaint(ctx: CanvasRenderingContext2D) {
    let points = this.points
    let n = points.length
    if (n < 1) {
      return
    }
    let style = this.style
    ctx.lineWidth = style.lineWidth
    ctx.strokeStyle = style.lineColor
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < n; i++) {
      ctx.lineTo(points[i].x, points[i].y)
    }
    if (this.close) {
      ctx.closePath()
    }
    ctx.stroke()
  }
}

export default QPath
