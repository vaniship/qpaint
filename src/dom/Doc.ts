import QStore from '../store/Store'
import { Point, HitResult, QShape } from './shape'

function deleteItem(array: Array<any>, item: any) {
  let index = array.indexOf(item)
  if (index !== -1) {
    array.splice(index, 1)
  }
}

class QPaintDoc {
  private shapes: Array<any> = []
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
      deleteItem(this.shapes, shape)
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
