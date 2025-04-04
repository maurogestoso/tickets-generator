import { useReducer } from "react";

export type TextLabel = {
  name: string;
  text: string;
  x: number;
  y: number;
  size: number;
};

type Action =
  | { type: "ADD_NEW_LABEL" }
  | { type: "EDIT_LABEL_TEXT"; payload: { index: number; text: string } }
  | {
      type: "UPDATE_LABEL_POSITION";
      payload: { index: number; x: number; y: number };
    }
  | {
      type: "UPDATE_LABEL_SIZE";
      payload: { index: number; size: number };
    };

export function useTextLabels() {
  const [textLabels, dispatch] = useReducer(reducer, []);
  return {
    textLabels,
    actions: {
      addNewLabel: () => dispatch({ type: "ADD_NEW_LABEL" }),
      editLabelText: ({ index, text }: { index: number; text: string }) =>
        dispatch({ type: "EDIT_LABEL_TEXT", payload: { index, text } }),
      updateLabelPosition: ({
        index,
        x,
        y,
      }: {
        index: number;
        x: number;
        y: number;
      }) =>
        dispatch({ type: "UPDATE_LABEL_POSITION", payload: { index, x, y } }),
      updateLabelSize: ({ index, size }: { index: number; size: number }) =>
        dispatch({ type: "UPDATE_LABEL_SIZE", payload: { index, size } }),
    },
  };
}

function reducer(state: TextLabel[], action: Action) {
  if (action.type === "ADD_NEW_LABEL") {
    return [
      ...state,
      {
        name: `Text label #${state.length + 1}`,
        text: "",
        x: 50,
        y: 50,
        size: 30,
      },
    ];
  }
  if (action.type === "EDIT_LABEL_TEXT") {
    return state.map((label, i) => {
      if (action.payload.index !== i) return label;

      return { ...label, text: action.payload.text };
    });
  }
  if (action.type === "UPDATE_LABEL_POSITION") {
    return state.map((label, i) => {
      if (action.payload.index !== i) return label;
      return { ...label, x: action.payload.x, y: action.payload.y };
    });
  }
  if (action.type === "UPDATE_LABEL_SIZE") {
    return state.map((label, i) => {
      if (action.payload.index !== i) return label;
      return { ...label, size: action.payload.size };
    });
  }
  return state;
}
