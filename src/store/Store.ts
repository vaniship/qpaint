import { QShape } from '../dom/shape'
import QPaintDoc from '../dom/Doc'

interface QDrawing {
  shapes: Array<QShape>
  idShapeBase: number
}

interface QStore {
  readonly id: string
  loadDrawing (): QDrawing
  saveShape (shape: QShape): void
  saveDocument (doc: QPaintDoc): void
}

export default QStore
