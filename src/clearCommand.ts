import type { Command } from "./commands/historyManager";
import { TextureCanvas } from "../src/painting/textureCanvas";

export class ClearCommand implements Command {
    private before: ImageData | null = null;
    private after: ImageData | null = null;

  constructor(private canvas: TextureCanvas) {
    const ctx = canvas.getCanvas().getContext("2d")!;
    this.before = ctx.getImageData(0, 0, canvas.getWidth(), canvas.getHeight());
  }

  execute(): void {
    const ctx = this.canvas.getCanvas().getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, this.canvas.getWidth(), this.canvas.getHeight());
  }

  undo(): void {
    const ctx = this.canvas.getCanvas().getContext("2d")!;
    ctx.putImageData(this.before!, 0, 0);
    }

  redo(): void {
      if (!this.after) return;

      const ctx = this.canvas.getCanvas().getContext("2d");
      if (!ctx) return;

      ctx.putImageData(this.after, 0, 0);
   }
}