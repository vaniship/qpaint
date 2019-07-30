import QStore from './Store'
import { QShape } from '../dom/shape'
import QPaintDoc from '../dom/Doc'
import { getShape } from '../dom/shapefactory'

function getNextID(key: string) {
  const val = localStorage.getItem(key)
  let dgBase: number
  if (val == null) {
    dgBase = 10000
  } else {
    dgBase = parseInt(val)
  }
  dgBase++
  return dgBase.toString()
}

function removeSomeCache() {
  let clearID = parseInt(getNextID('dgClear'))
  for (let i = 0; i < 32; i++) {
    let key = 'dg:' + clearID
    let doc = localStorage.getItem(key)
    if (doc != null) {
      let o = JSON.parse(doc)
      for (let i in o.shapes) {
        localStorage.removeItem(o.id + ':' + o.shapes[i])
      }
      localStorage.removeItem(key)
      localStorage.setItem('dgClear', clearID.toString())
      return
    }
    clearID++
  }
}

function localStorage_setItem(key: string, val: string) {
  try {
    localStorage.setItem(key, val)
  } catch (e) {
    if (e.name == 'QuotaExceededError') {
      removeSomeCache()
      localStorage.setItem(key, val)
    }
  }
}

function makeLocalDrawingID() {
  let val = getNextID('dgBase')
  localStorage_setItem('dgBase', val)
  return val
}

class LocalStorageStore implements QStore {
  constructor (public readonly id: string = makeLocalDrawingID()) {}

  loadDrawing () {
    const val = localStorage.getItem(`dg:${this.id}`)
    let o = JSON.parse(val!)
    if (o == null) {
      return { shapes: [], idShapeBase: 0}
    }
    let shapes = []
    let idShapeBase = -1
    for (let i in o.shapes) {
      let shapeID = `sp:${this.id}:${o.shapes[i]}`
      let shape = getShape(JSON.parse(localStorage.getItem(shapeID)!))
      if (shape === null) {
        continue
      }
      shape.id = o.shapes[i]
      idShapeBase = Math.max(idShapeBase, parseInt(shape.id))
      shapes.push(shape)
    }
    idShapeBase++
    return {
      shapes,
      idShapeBase
    }
  }

  saveShape (shape: QShape) {
    localStorage_setItem(`sp:${this.id}:${shape.id}`, shape.toJSONString())
  }

  saveDocument (doc: QPaintDoc) {
    localStorage_setItem(`dg:${this.id}`, doc.toJSONString())
  }
}

export default LocalStorageStore
