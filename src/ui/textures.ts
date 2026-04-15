import { ShapeManager } from "../scene/shapeManager";

type TextureButtonConfig = {
  buttonId: string;
  assetUrl: string;
};

type TextureBindings = {
  shapeManager: ShapeManager;
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));

    img.src = src;
  });
}

function drawImageToCanvas(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number
): void {
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
}

function applyImageToActiveShape(
  img: HTMLImageElement,
  shapeManager: ShapeManager
): void {
  const activeShape = shapeManager.getActiveShape();
  if (!activeShape) {
    return;
  }

  activeShape.textureCanvases.forEach((textureCanvas) => {
    const ctx = textureCanvas.getCanvas().getContext("2d");
    if (!ctx) {
      return;
    }

    drawImageToCanvas(
      ctx,
      img,
      textureCanvas.getWidth(),
      textureCanvas.getHeight()
    );
  });

  activeShape.materials.forEach((material) => {
    if (material.map) {
      material.map.needsUpdate = true;
    }
  });
}

export function bindTextureButtons({
  shapeManager
}: TextureBindings): void {
  const buttons: TextureButtonConfig[] = [
    {
      buttonId: "applyBrickBtn",
      assetUrl: new URL("../assets/brick.jpg", import.meta.url).href
    },
    {
      buttonId: "applyFabricBtn",
      assetUrl: new URL("../assets/fabric-stripes.jpg", import.meta.url).href
    },
    {
      buttonId: "applyWaterBtn",
      assetUrl: new URL("../assets/water.jpg", import.meta.url).href
    },
    {
      buttonId: "applyRockPathBtn",
      assetUrl: new URL("../assets/rock-path.jpg", import.meta.url).href
    },
    {
      buttonId: "applyAbstractBtn",
      assetUrl: new URL("../assets/abstract-stripes.jpg", import.meta.url).href
    }
  ];

  buttons.forEach(({ buttonId, assetUrl }) => {
    const button = document.getElementById(buttonId) as HTMLButtonElement | null;
    if (!button) {
      return;
    }

    button.addEventListener("click", async () => {
      try {
        const img = await loadImage(assetUrl);
        applyImageToActiveShape(img, shapeManager);
      } catch (error) {
        console.error(error);
      }
    });
  });
}

export function bindTextureUpload({
  shapeManager
}: TextureBindings): void {
  const textureUpload = document.getElementById(
    "textureUpload"
  ) as HTMLInputElement | null;

  if (!textureUpload) {
    return;
  }

  textureUpload.addEventListener("change", (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (loadEvent: ProgressEvent<FileReader>) => {
      const dataUrl = loadEvent.target?.result;
      if (typeof dataUrl !== "string") {
        return;
      }

      const img = new Image();

      img.onload = () => {
        applyImageToActiveShape(img, shapeManager);
      };

      img.onerror = () => {
        console.error("Failed to load uploaded texture image.");
      };

      img.src = dataUrl;
    };

    reader.onerror = () => {
      console.error("Failed to read uploaded texture file.");
    };

    reader.readAsDataURL(file);
    textureUpload.value = "";
  });
}