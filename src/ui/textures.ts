import { Shape } from "three";
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
    shapeManager: ShapeManager,
    faceNum: number
): void {
    const activeShape = shapeManager.getActiveShape();
    if (!activeShape) return;

    // apply image to every face
    if (faceNum == -1) {
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
    else {
        const textureCanvas = activeShape.textureCanvases[faceNum];
        if (!textureCanvas) return;

        const ctx = textureCanvas.getCanvas().getContext("2d");
        if (!ctx) return;

        drawImageToCanvas(
            ctx,
            img,
            textureCanvas.getWidth(),
            textureCanvas.getHeight()
        );

        const material = activeShape.materials[faceNum];
        if (material?.map) {
            material.map.needsUpdate = true;
        }
    }
    
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
        applyImageToActiveShape(img, shapeManager,-1);
      } catch (error) {
        console.error(error);
      }
    });
  });
}

export function bindTextureUpload({
  shapeManager
}: TextureBindings): void {
  const textureUpload0 = document.getElementById(
    "textureUpload0"
    ) as HTMLInputElement | null;
    const textureUpload1 = document.getElementById(
        "textureUpload1"
    ) as HTMLInputElement | null;
    const textureUpload2 = document.getElementById(
        "textureUpload2"
    ) as HTMLInputElement | null;
    const textureUpload3 = document.getElementById(
        "textureUpload3"
    ) as HTMLInputElement | null;
    const textureUpload4 = document.getElementById(
        "textureUpload4"
    ) as HTMLInputElement | null;
    const textureUpload5 = document.getElementById(
        "textureUpload5"
    ) as HTMLInputElement | null;
  if (!(textureUpload0 && textureUpload1 && textureUpload2 && textureUpload3 && textureUpload4 && textureUpload5)) {
    return;
  }

  textureUpload0.addEventListener("change", (event: Event) => {
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
        applyImageToActiveShape(img, shapeManager, 0);
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
    textureUpload0.value = "";
  });

    textureUpload1.addEventListener("change", (event: Event) => {
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
                applyImageToActiveShape(img, shapeManager, 1);
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
        textureUpload1.value = "";
    });
    textureUpload2.addEventListener("change", (event: Event) => {
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
                applyImageToActiveShape(img, shapeManager, 2);
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
        textureUpload2.value = "";
    });
    textureUpload3.addEventListener("change", (event: Event) => {
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
                applyImageToActiveShape(img, shapeManager, 3);
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
        textureUpload3.value = "";
    });
    textureUpload4.addEventListener("change", (event: Event) => {
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
                applyImageToActiveShape(img, shapeManager, 4);
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
        textureUpload4.value = "";
    });
    textureUpload5.addEventListener("change", (event: Event) => {
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
                applyImageToActiveShape(img, shapeManager, 5);
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
        textureUpload5.value = "";
    });
}