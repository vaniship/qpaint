import QPaintView from './View'
import QPathCreator from './creator/Path'
import QFreePathCreator from './creator/FreePath'
import QRectCreator from './creator/Rect'
import QShapeSelector from './accel/Selector'
import buildMenu from './accel/menu'
import LoaclStorageStore from './store/LoaclStorageStore'

let displayID
let localID
const hash = window.location.hash
if (hash !== '') { // #t[localID]
  displayID = hash.substring(1)
  localID = displayID.substring(1)
}
const store = new LoaclStorageStore(localID)

displayID = 't' + store.id
window.location.hash = '#' + displayID

const qview = new QPaintView(document.getElementById("drawing") as HTMLCanvasElement, store)

qview.registerController('FreePathCreator', () => new QFreePathCreator(qview))
qview.registerController('PathCreator', () => new QPathCreator(qview, false))
qview.registerController('LineCreator', () => new QRectCreator(qview, 'line'))
qview.registerController('RectCreator', () => new QRectCreator(qview, 'rect'))
qview.registerController('EllipseCreator', () => new QRectCreator(qview, 'ellipse'))
qview.registerController('CircleCreator', () => new QRectCreator(qview, 'circle'))
qview.registerController('ShapeSelector', () => new QShapeSelector(qview))

buildMenu(document.getElementById("menu") as HTMLElement, qview)
