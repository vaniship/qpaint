import QPaintView from './view'
import QPathCreator from './creator/path'
import QFreePathCreator from './creator/freepath'
import QRectCreator from './creator/rect'
import QShapeSelector from './accel/select'
import buildMenu from './accel/menu'

const qview = new QPaintView(document.getElementById("drawing") as HTMLCanvasElement)

qview.registerController('FreePathCreator', () => new QFreePathCreator(qview))
qview.registerController('PathCreator', () => new QPathCreator(qview, false))
qview.registerController('LineCreator', () => new QRectCreator(qview, 'line'))
qview.registerController('RectCreator', () => new QRectCreator(qview, 'rect'))
qview.registerController('EllipseCreator', () => new QRectCreator(qview, 'ellipse'))
qview.registerController('CircleCreator', () => new QRectCreator(qview, 'circle'))
qview.registerController("ShapeSelector", () => new QShapeSelector(qview))

buildMenu(document.getElementById("menu") as HTMLElement, qview)
