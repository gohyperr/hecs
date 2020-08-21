import { System, Groups } from 'hecs'

export class RenderSystem extends System {
  order = Groups.Presentation + 100

  init({ presentation }) {
    this.presentation = presentation
  }

  update() {
    if (!this.presentation.viewport) return
    this.presentation.renderer.render(
      this.presentation.scene,
      this.presentation.camera
    )
  }
}
