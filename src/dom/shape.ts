type Point = { x: number, y: number }
type Rect = { x: number, y: number, width: number, height: number }
type RectByPoint = { pt1: Point, pt2: Point }
type HitResult = { hitCode: number, hitShape: QShape | null }

function hitLine(pt: Point, pt1: Point, pt2: Point, width: number) {
  if ((pt1.x - pt.x) * (pt.x - pt2.x) < 0) {
    return false
  }
  if ((pt1.y - pt.y) * (pt.y - pt2.y) < 0) {
    return false
  }
  let dy = pt2.y - pt1.y
  let dx = pt2.x - pt1.x
  let d12 = Math.sqrt(dx * dx + dy * dy)
  if (d12 < 0.1) {
    return false
  }
  let d = Math.abs(dy * pt.x - dx * pt.y + pt2.x * pt1.y - pt1.x * pt2.y) / d12 - 2
  return width >= d * 2
}

function hitRect(pt: Point, r: Rect) {
  if ((r.x + r.width - pt.x) * (pt.x - r.x) < 0) {
    return false
  }
  if ((r.y + r.height - pt.y) * (pt.y - r.y) < 0) {
    return false
  }
  return true
}

function normalizeRect(rect: RectByPoint): Rect {
  let x = rect.pt1.x
  let y = rect.pt1.y
  let width = rect.pt2.x - x
  let height = rect.pt2.y - y
  if (width < 0) {
    x = rect.pt2.x
    width = -width
  }
  if (height < 0) {
    y = rect.pt2.y
    height = -height
  }
  return { x: x, y: y, width: width, height: height }
}

function fill(ctx: CanvasRenderingContext2D, fillColor: string) {
  if (fillColor != "null") {
    ctx.fillStyle = fillColor
    ctx.fill()
  }
}

class QShapeStyle {
  [x: string]: any
  constructor(public lineWidth: number, public lineColor: string, public fillColor: string) {
    this.lineWidth = lineWidth
    this.lineColor = lineColor
    this.fillColor = fillColor
  }
  setProp(key: string, val: any) {
    this[key] = val
  }
  clone() {
    return new QShapeStyle(this.lineWidth, this.lineColor, this.fillColor)
  }
}

interface QShape {
  readonly id: string
  style: QShapeStyle
  setProp(key: string, val: any): void
  bound(): Rect
  hitTest(pt: Point): HitResult
  move(dx: number, dy: number): void
  onpaint(ctx: CanvasRenderingContext2D): void
  toJSONString(): string
}

export {
  Point,
  Rect,
  RectByPoint,
  HitResult,
  QShapeStyle,
  QShape,
  hitLine,
  hitRect,
  normalizeRect,
  fill
}
