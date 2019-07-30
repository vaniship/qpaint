import QController from './Controller'
import QPaintDoc from './dom/Doc'
import { QShapeStyle, QShape } from './dom/shape'
import QStore from './store/Store'

type EventHandler = (evt: any) => void

class QPaintView {
  private _currentKey: string = ''
  private _current: QController|null = null
  private _selection: QShape|null = null

  public style: QShapeStyle
  public controllers: {[x: string]: () => QController} = {}
  public onSelectionChanged: EventHandler|null = null
  public onControllerReset: (()=>void)|null = null
  public doc: QPaintDoc

  constructor(public drawing: HTMLCanvasElement, store: QStore) {
    drawing.onmousedown = (event) => {
      event.preventDefault()
      if (this._current && this._current.onmousedown !== null) {
        this._current.onmousedown(event)
      }
    }
    drawing.onmousemove = (event) => {
      if (this._current && this._current.onmousemove !== null) {
        this._current.onmousemove(event)
      }
    }
    drawing.onmouseup = (event) => {
      if (this._current && this._current.onmouseup !== null) {
        this._current.onmouseup(event)
      }
    }
    drawing.ondblclick = (event) => {
      event.preventDefault()
      if (this._current && this._current.ondblclick !== null) {
        this._current.ondblclick(event)
      }
    }
    document.onkeydown = (event) => {
      switch (event.keyCode) {
        case 9: case 13: case 27:
          event.preventDefault()
      }
      if (this._current && this._current.onkeydown != null) {
        this._current.onkeydown(event)
      }
    }
    this.style = new QShapeStyle(1, 'black', 'white')
    this.doc = new QPaintDoc(store)
    this.invalidate(null)
  }

  get currentKey() {
    return this._currentKey
  }

  get selection() {
    return this._selection
  }

  set selection(shape) {
    let old = this._selection
    if (old != shape) {
      this._selection = shape
      if (this.onSelectionChanged != null) {
        this.onSelectionChanged(old)
      }
    }
  }

  getMousePos(event: MouseEvent) {
    return {
      x: event.offsetX,
      y: event.offsetY
    }
  }

  onpaint(ctx: CanvasRenderingContext2D) {
    this.doc.onpaint(ctx)
    if (this._current != null) {
      this._current.onpaint(ctx)
    }
  }

  invalidateRect(reserved: any) {
    const ctx = this.drawing.getContext('2d')
    if (ctx !== null) {
      const bound = this.drawing.getBoundingClientRect()
      ctx.clearRect(0, 0, bound.width, bound.height)
      this.onpaint(ctx)
    }
  }

  invalidate(reserved: any) {
    this.invalidateRect(null)
  }

  registerController(name: string, controller: () => QController) {
    if (name in this.controllers) {
      alert('Controller exists: ' + name)
    } else {
      this.controllers[name] = controller
    }
  }

  invokeController(name: string) {
    this.stopController()
    if (name in this.controllers) {
      let controller = this.controllers[name]
      this._setCurrent(name, controller())
    }
  }

  stopController() {
    if (this._current != null) {
      this._current.stop()
      this._setCurrent('', null)
    }
  }

  fireControllerReset() {
    if (this.onControllerReset != null) {
      this.onControllerReset()
    }
  }

  private _setCurrent(name: string, ctrl: QController|null) {
    this._current = ctrl
    this._currentKey = name
  }
}

export default QPaintView
