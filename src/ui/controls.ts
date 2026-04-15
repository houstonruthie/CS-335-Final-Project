import type { BrushType } from "../painting/brush";
import type { ShapeType, ToolMode } from "../utils/constants";

export type UIElements = {
  shapeTypeSelect: HTMLSelectElement;
  toolModeSelect: HTMLSelectElement;
  brushTypeSelect: HTMLSelectElement;
  colorPicker: HTMLInputElement;
  brushSizeSlider: HTMLInputElement;
  brushSizeValue: HTMLSpanElement;
  brushOpacitySlider: HTMLInputElement;
  brushOpacityValue: HTMLSpanElement;
  textureUpload: HTMLInputElement | null;
};

export type UIState = {
  shapeType: ShapeType;
  toolMode: ToolMode;
  brushType: BrushType;
  brushColor: string;
  brushSize: number;
  brushOpacity: number;
};

export function getUIElements(): UIElements {
  const shapeTypeSelect = document.getElementById("shapeType") as HTMLSelectElement;
  const toolModeSelect = document.getElementById("toolMode") as HTMLSelectElement;
  const brushTypeSelect = document.getElementById("brushType") as HTMLSelectElement;
  const colorPicker = document.getElementById("colorPicker") as HTMLInputElement;
  const brushSizeSlider = document.getElementById("brushSize") as HTMLInputElement;
  const brushSizeValue = document.getElementById("brushSizeValue") as HTMLSpanElement;
  const brushOpacitySlider = document.getElementById("opacity") as HTMLInputElement;
  const brushOpacityValue = document.getElementById("brushOpacityValue") as HTMLSpanElement;
  const textureUpload = document.getElementById("textureUpload") as HTMLInputElement | null;

  if (
    !shapeTypeSelect ||
    !toolModeSelect ||
    !brushTypeSelect ||
    !colorPicker ||
    !brushSizeSlider ||
    !brushSizeValue ||
    !brushOpacitySlider ||
    !brushOpacityValue
  ) {
    throw new Error("Missing UI controls.");
  }

  return {
    shapeTypeSelect,
    toolModeSelect,
    brushTypeSelect,
    colorPicker,
    brushSizeSlider,
    brushSizeValue,
    brushOpacitySlider,
    brushOpacityValue,
    textureUpload
  };
}

export function createUIState(elements: UIElements): UIState {
  return {
    shapeType: elements.shapeTypeSelect.value as ShapeType,
    toolMode: elements.toolModeSelect.value as ToolMode,
    brushType: elements.brushTypeSelect.value as BrushType,
    brushColor: elements.colorPicker.value,
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

  elements.colorPicker.addEventListener("input", () => {
    state.brushColor = elements.colorPicker.value;
  });

  elements.brushSizeSlider.addEventListener("input", () => {
    state.brushSize = Number(elements.brushSizeSlider.value);
    elements.brushSizeValue.textContent = elements.brushSizeSlider.value;
  });

  elements.brushOpacitySlider.addEventListener("input", () => {
    state.brushOpacity = Number(elements.brushOpacitySlider.value) / 100;
    elements.brushOpacityValue.textContent = elements.brushOpacitySlider.value;
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