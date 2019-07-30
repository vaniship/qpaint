import { Point, Rect, HitResult, QShape, QShapeStyle } from './shape'

abstract class QShapeBase implements QShape {
  constructor(public id: string, public style: QShapeStyle) {}

  abstract bound(): Rect
  abstract move(dx: number, dy: number): void
  abstract hitTest(pt: Point): HitResult
  abstract onpaint(ctx: CanvasRenderingContext2D): void

  setProp(key: string, val: any) {
    this.style.setProp(key, val)
  }

  toJSONString () {
    return JSON.stringify({...this, ...{type: this.constructor.name}})
  }
}

export default QShapeBase
