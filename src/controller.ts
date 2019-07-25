interface QController {
  stop(): void
  reset(): void
  onpaint(ctx: CanvasRenderingContext2D): void

  onmousedown(event: MouseEvent): void
  onmousemove(event: MouseEvent): void
  onmouseup(event: MouseEvent): void
  ondblclick(event: MouseEvent): void
  onkeydown(event: KeyboardEvent): void
}

export default QController
