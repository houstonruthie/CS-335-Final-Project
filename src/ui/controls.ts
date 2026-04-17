import type { BrushType } from "../painting/brush";
import type { ShapeType, ToolMode } from "../utils/constants";
import type { ShapeManager } from "../scene/shapeManager";
import { HistoryManager } from "../painting/history";

export type UIElements = {
  shapeTypeSelect: HTMLSelectElement;
  toolModeSelect: HTMLSelectElement;
  brushTypeSelect: HTMLSelectElement;
  colorPicker: HTMLInputElement;
  prevColor: HTMLButtonElement;
  brushSizeSlider: HTMLInputElement;
  brushSizeValue: HTMLSpanElement;
  brushOpacitySlider: HTMLInputElement;
  brushOpacityValue: HTMLSpanElement;
  textureUpload: HTMLInputElement | null;
  clearBtn: HTMLButtonElement;
  undoBtn: HTMLButtonElement;
  redoBtn: HTMLButtonElement;
};

export type UIState = {
  shapeType: ShapeType;
  toolMode: ToolMode;
  brushType: BrushType;
  brushColor: string;
  prevColor: string;
  brushSize: number;
  brushOpacity: number;
};

export function getUIElements(): UIElements {
  const shapeTypeSelect = document.getElementById("shapeType") as HTMLSelectElement;
  const toolModeSelect = document.getElementById("toolMode") as HTMLSelectElement;
  const brushTypeSelect = document.getElementById("brushType") as HTMLSelectElement;
  const colorPicker = document.getElementById("colorPicker") as HTMLInputElement;
  const prevColor = document.getElementById("prevColor") as HTMLButtonElement;
  const brushSizeSlider = document.getElementById("brushSize") as HTMLInputElement;
  const brushSizeValue = document.getElementById("brushSizeValue") as HTMLSpanElement;
  const brushOpacitySlider = document.getElementById("opacity") as HTMLInputElement;
  const brushOpacityValue = document.getElementById("brushOpacityValue") as HTMLSpanElement;
  const textureUpload = document.getElementById("textureUpload") as HTMLInputElement | null;
  const clearBtn = document.getElementById("clearBtn") as HTMLButtonElement;
  const undoBtn = document.getElementById("undoBtn") as HTMLButtonElement;
  const redoBtn = document.getElementById("redoBtn") as HTMLButtonElement;



  if (
    !shapeTypeSelect ||
    !toolModeSelect ||
    !brushTypeSelect ||
    !colorPicker ||
    !prevColor ||
    !brushSizeSlider ||
    !brushSizeValue ||
    !brushOpacitySlider ||
    !brushOpacityValue ||
    !clearBtn ||
    !undoBtn ||
    !redoBtn
  ) {
    throw new Error("Missing UI controls.");
  }

  return {
    shapeTypeSelect,
    toolModeSelect,
    brushTypeSelect,
    colorPicker,
    prevColor,
    brushSizeSlider,
    brushSizeValue,
    brushOpacitySlider,
    brushOpacityValue,
    textureUpload,
    clearBtn,
    undoBtn,
    redoBtn
  };
}

export function createUIState(elements: UIElements): UIState {
  return {
    shapeType: elements.shapeTypeSelect.value as ShapeType,
    toolMode: elements.toolModeSelect.value as ToolMode,
    brushType: elements.brushTypeSelect.value as BrushType,
    brushColor: elements.colorPicker.value,
    prevColor: elements.prevColor.style.backgroundColor,
    brushSize: Number(elements.brushSizeSlider.value),
    brushOpacity: Number(elements.brushOpacitySlider.value) / 100
  };
}

export function bindUIState(
  elements: UIElements,
  state: UIState,
  onObjectChange: () => void
): void {
  elements.shapeTypeSelect.addEventListener("change", () => {
    state.shapeType = elements.shapeTypeSelect.value as ShapeType;
    onObjectChange();
  });

  elements.toolModeSelect.addEventListener("change", () => {
    state.toolMode = elements.toolModeSelect.value as ToolMode;
  });

  elements.brushTypeSelect.addEventListener("change", () => {
    state.brushType = elements.brushTypeSelect.value as BrushType;
  });
    let lastCommittedColor = state.brushColor;
    elements.colorPicker.addEventListener("change", () => {
        state.prevColor = lastCommittedColor;

        lastCommittedColor = elements.colorPicker.value;
        state.brushColor = elements.colorPicker.value;

        elements.prevColor.style.backgroundColor = state.prevColor;
    });

    elements.prevColor.addEventListener("click", () => {
        const temp = state.brushColor;
        state.brushColor = state.prevColor;

        elements.colorPicker.value = state.brushColor;
        elements.prevColor.style.backgroundColor = temp;
    });

  elements.brushSizeSlider.addEventListener("input", () => {
    state.brushSize = Number(elements.brushSizeSlider.value);
    elements.brushSizeValue.textContent = elements.brushSizeSlider.value;
  });

  elements.brushOpacitySlider.addEventListener("input", () => {
    state.brushOpacity = Number(elements.brushOpacitySlider.value) / 100;
    elements.brushOpacityValue.textContent = elements.brushOpacitySlider.value;
  });
  window.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === '[') {
          state.brushSize = Number(elements.brushSizeSlider.value);
          if (state.brushSize >= 6) {
              state.brushSize -= 5;
          }
          else {
              state.brushSize = 1;
          }
          elements.brushSizeValue.textContent = String(state.brushSize);
          elements.brushSizeSlider.value = String(state.brushSize);
      }
  });
  window.addEventListener("keydown", (event: KeyboardEvent) => {
      if (event.key === ']') {
          state.brushSize = Number(elements.brushSizeSlider.value);
          if (state.brushSize < 95) {
              state.brushSize += 5;
          }
          else {
              state.brushSize = 100;
          }
          elements.brushSizeValue.textContent = String(state.brushSize);
          elements.brushSizeSlider.value = String(state.brushSize);
      }
  });
}



export function bindUiPanelToggle(): void {
  const toggleUiBtn = document.getElementById(
    "toggleUiBtn"
  ) as HTMLButtonElement | null;

  const uiPanel = document.getElementById(
    "ui-panel"
  ) as HTMLDivElement | null;

  if (!toggleUiBtn || !uiPanel) {
    throw new Error("UI panel toggle elements not found");
  }

  toggleUiBtn.addEventListener("click", () => {
    uiPanel.classList.toggle("hidden");
  });
}

export function bindClearButton(
  elements: UIElements,
  shapeManager: ShapeManager,
  historyManager: HistoryManager
): void {
  elements.clearBtn.addEventListener("click", () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to clear your texture?"
    );

    if (!isConfirmed) {
      console.log("User clicked Cancel");
      return;
    }

    const activeShape = shapeManager.getActiveShape();
    if (!activeShape) {
      return;
    }

    historyManager.saveSnapshot();

    activeShape.painters.forEach((painter) => {
      painter.clear();
    });

    activeShape.materials.forEach((material) => {
      if (material.map) {
        material.map.needsUpdate = true;
      }
    });
  });
}

export function bindHistoryControls(
  elements: UIElements,
  historyManager: HistoryManager
): void {
  elements.undoBtn.addEventListener("click", () => {
    historyManager.undo();
  });

  elements.redoBtn.addEventListener("click", () => {
    historyManager.redo();
  });

  window.addEventListener("keydown", (event: KeyboardEvent) => {
    if (!event.ctrlKey) {
      return;
    }

    const key = event.key.toLowerCase();

    if (key === "z" && !event.shiftKey) {
      event.preventDefault();
      historyManager.undo();
    } else if (key === "z" && event.shiftKey) {
      event.preventDefault();
      historyManager.redo();
    }
  });
}