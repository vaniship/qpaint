import QStore from '../store/Store'
import { Point, HitResult, QShape } from './shape'

class QPaintDoc {
  private shapes: Array<QShape> = []
  private idShapeBase: number = 0
  displayID: string = ''

  constructor(public store: QStore) {
    let drawing = store.loadDrawing()
    this.shapes = drawing.shapes
    this.idShapeBase = drawing.idShapeBase
  }

  getNextShapeId () {
    return (this.idShapeBase++).toString()
  }

  toJSONString() {
    let shapeIDs = []
    let shapes = this.shapes
    for (let i in shapes) {
      shapeIDs.push(shapes[i].id)
    }
    return JSON.stringify({
      shapes: shapeIDs
    })
  }

  addShape(shape: QShape | null) {
    // TODO id 判重
    if (shape != null) {
      this.shapes.push(shape)
      this.store.saveShape(shape)
      this.store.saveDocument(this)
    }
  }

  deleteShape(shape: QShape | null) {
    if (shape !== null) {
      let index = this.shapes.indexOf(shape)
      if (index !== -1) {
        this.shapes.splice(index, 1)
      }
      this.store.saveDocument(this)
    }
  }

  hitTest(pt: Point): HitResult {
    let shapes = this.shapes
    let n = shapes.length
    for (let i = n - 1; i >= 0; i--) {
      let ret = shapes[i].hitTest(pt)
      if (ret.hitCode > 0) {
        return ret
      }
    }
    return { hitCode: 0, hitShape: null }
  }

  onpaint(ctx: CanvasRenderingContext2D) {
    let shapes = this.shapes
    for (let i in shapes) {
      shapes[i].onpaint(ctx)
    }
  }
}

export default QPaintDoc
