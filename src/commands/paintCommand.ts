import { TextureCanvas } from "../painting/textureCanvas";

export class PaintCommand {
    private before: ImageData | null = null;
    private after: ImageData | null = null;

    constructor(private canvas: TextureCanvas) { }

    captureBefore(): void {
        const ctx = this.canvas.getCanvas().getContext("2d");
        if (!ctx) return;

        this.before = ctx.getImageData(
            0,
            0,
            this.canvas.getWidth(),
            this.canvas.getHeight()
        );
    }

    captureAfter(): void {
        const ctx = this.canvas.getCanvas().getContext("2d");
        if (!ctx) return;

        this.after = ctx.getImageData(
            0,
            0,
            this.canvas.getWidth(),
            this.canvas.getHeight()
        );
    }

    undo(): void {
        if (!this.before) return;

        const ctx = this.canvas.getCanvas().getContext("2d");
        if (!ctx) return;

        ctx.putImageData(this.before, 0, 0);
    }

    redo(): void {
        if (!this.after) return;

        const ctx = this.canvas.getCanvas().getContext("2d");
        if (!ctx) return;

        ctx.putImageData(this.after, 0, 0);
    }
}