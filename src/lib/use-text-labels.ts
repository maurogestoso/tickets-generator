import { create } from "zustand";

export type TextLabel = {
  name: string;
  text: string;
  x: number;
  y: number;
  size: number;
};

export type TextLabelsState = {
  textLabels: TextLabel[];
  actions: {
    addNewLabel: () => void;
    editLabelText: (labelIdx: number, newText: string) => void;
    updateLabelPosition: (
      labelIdx: number,
      newPos: { x: number; y: number },
    ) => void;
    updateLabelSize: (labelIdx: number, newSize: number) => void;
  };
};

export const useTextLabels = create<TextLabelsState>()((set) => ({
  textLabels: [],
  actions: {
    addNewLabel: () =>
      set((state) => ({
        ...state,
        textLabels: [
          ...state.textLabels,
          {
            name: `Text label #${state.textLabels.length + 1}`,
            text: "",
            x: 50,
            y: 50,
            size: 30,
          },
        ],
      })),
    editLabelText: (labelIdx: number, newText: string) =>
      set((state) => {
        return {
          ...state,
          textLabels: state.textLabels.map((label, index) => {
            if (index === labelIdx) {
              return { ...label, text: newText };
            }
            return label;
          }),
        };
      }),
    updateLabelPosition: (labelIdx: number, newPos: { x: number; y: number }) =>
      set((state) => ({
        ...state,
        textLabels: state.textLabels.map((label, index) => {
          if (index === labelIdx) {
            return { ...label, x: newPos.x, y: newPos.y };
          }
          return label;
        }),
      })),
    updateLabelSize: (labelIdx: number, newSize: number) =>
      set((state) => ({
        ...state,
        textLabels: state.textLabels.map((label, index) => {
          if (index === labelIdx) {
            return { ...label, size: newSize };
          }
          return label;
        }),
      })),
  },
}));
