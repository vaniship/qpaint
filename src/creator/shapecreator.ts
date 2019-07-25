import QController from '../controller'
import QPaintView from '../view'

abstract class QShapeCreator implements QController {
  protected started: boolean = false

  constructor(protected qview: QPaintView) {}

  stop() {}

  reset() {
    this.started = false
    this.qview.fireControllerReset()
  }

  abstract onmousedown(event: MouseEvent): void
  abstract onmousemove(event: MouseEvent): void
  abstract onmouseup(event: MouseEvent): void
  abstract ondblclick(event: MouseEvent): void
  abstract onkeydown(event: KeyboardEvent): void

  abstract onpaint(ctx: CanvasRenderingContext2D): void
}

export default QShapeCreator
