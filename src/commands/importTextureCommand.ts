export class ImportTextureCommand implements Command {
  private before: ImageData;
  private after: ImageData;

  constructor(
    private canvas: TextureCanvas,
    private image: HTMLImageElement
  ) {
    const ctx = canvas.getCanvas().getContext("2d")!;
    this.before = ctx.getImageData(0, 0, canvas.getWidth(), canvas.getHeight());
  }

  execute(): void {
    const ctx = this.canvas.getCanvas().getContext("2d")!;
    ctx.drawImage(this.image, 0, 0, this.canvas.getWidth(), this.canvas.getHeight());
  }

  undo(): void {
    const ctx = this.canvas.getCanvas().getContext("2d")!;
    ctx.putImageData(this.before, 0, 0);
  }
}