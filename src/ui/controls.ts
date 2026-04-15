import type { BrushType } from "../painting/brush";
import type { ObjectType, ToolMode } from "../utils/constants";

export type UIElements = {
  objectTypeSelect: HTMLSelectElement;
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
  objectType: ObjectType;
  toolMode: ToolMode;
  brushType: BrushType;
  brushColor: string;
  brushSize: number;
  brushOpacity: number;
};

export function getUIElements(): UIElements {
  const objectTypeSelect = document.getElementById("objectType") as HTMLSelectElement;
  const toolModeSelect = document.getElementById("toolMode") as HTMLSelectElement;
  const brushTypeSelect = document.getElementById("brushType") as HTMLSelectElement;
  const colorPicker = document.getElementById("colorPicker") as HTMLInputElement;
  const brushSizeSlider = document.getElementById("brushSize") as HTMLInputElement;
  const brushSizeValue = document.getElementById("brushSizeValue") as HTMLSpanElement;
  const brushOpacitySlider = document.getElementById("opacity") as HTMLInputElement;
  const brushOpacityValue = document.getElementById("brushOpacityValue") as HTMLSpanElement;
  const textureUpload = document.getElementById("textureUpload") as HTMLInputElement | null;

  if (
    !objectTypeSelect ||
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
    objectTypeSelect,
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
    objectType: elements.objectTypeSelect.value as ObjectType,
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
  elements.objectTypeSelect.addEventListener("change", () => {
    state.objectType = elements.objectTypeSelect.value as ObjectType;
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