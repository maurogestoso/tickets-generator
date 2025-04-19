import { type } from "arktype";
import { create } from "zustand";

const LabelName = type("string");
type LabelName = typeof LabelName.infer;

const TextLabel = type({
  name: LabelName,
  text: "string",
  x: "number",
  y: "number",
  size: "number",
  "csvHeader?": "string",
});
export type TextLabel = typeof TextLabel.infer;

type LabelsState = {
  textLabels: Record<LabelName, TextLabel>;
  actions: {
    addNewLabel: (name: string, value: string, csvHeader?: string) => void;
    updateText: (name: string, text: string) => void;
    updatePosition: (name: string, { x, y }: { x: number; y: number }) => void;
    updateSize: (name: string, size: number) => void;
  };
};

export const useTextLabels = create<LabelsState>()((set) => ({
  textLabels: {},
  actions: {
    addNewLabel(name, value, csvHeader) {
      const newLabel = { name, x: 0, y: 0, text: value, size: 30, csvHeader };

      set((state) => ({
        textLabels: {
          ...state.textLabels,
          [name]: newLabel,
        },
      }));
    },
    updateText(name, text) {
      set((state) => ({
        textLabels: {
          ...state.textLabels,
          [name]: {
            ...state.textLabels[name],
            text,
          },
        },
      }));
    },
    updatePosition(name, { x, y }) {
      set((state) => ({
        textLabels: {
          ...state.textLabels,
          [name]: {
            ...state.textLabels[name],
            x,
            y,
          },
        },
      }));
    },
    updateSize(name, size) {
      set((state) => ({
        textLabels: {
          ...state.textLabels,
          [name]: {
            ...state.textLabels[name],
            size,
          },
        },
      }));
    },
  },
}));
