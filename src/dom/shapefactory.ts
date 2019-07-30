import { QShapeStyle } from './shape'
import QLine from './Line'
import QRect from './Rect'
import QEllipse from './Ellipse'
import QPath from './Path'

function getShape (o: any) {
  if (o == null) {
    return null
  }
  const id = o.id
  const sty = o.style
  const style = new QShapeStyle(sty.lineWidth, sty.lineColor, sty.fillColor)
  switch (o.type) {
    case 'QLine':
      return new QLine(id, o.pt1, o.pt2, style)
    case 'QRect':
      return new QRect(id, o, style)
    case 'QEllipse':
      return new QEllipse(id, o.x, o.y, o.radiusX, o.radiusY, style)
    case 'QPath':
      return new QPath(id, o.points, o.close, style)
    default:
      alert('loadShape: unknown shape type - ' + o.type)
      return null
  }
}

export {
  getShape
}
