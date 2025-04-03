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
  | { type: "EDIT_LABEL_TEXT"; payload: { index: number; text: string } };

export function useTextLabels() {
  const [textLabels, dispatch] = useReducer(reducer, []);
  return {
    textLabels,
    actions: {
      addNewLabel: () => dispatch({ type: "ADD_NEW_LABEL" }),
      editLabelText: ({ index, text }: { index: number; text: string }) =>
        dispatch({ type: "EDIT_LABEL_TEXT", payload: { index, text } }),
    },
  };
}

function reducer(state: TextLabel[], action: Action) {
  if (action.type === "ADD_NEW_LABEL") {
    return [
      ...state,
      {
        name: "New text label",
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
  return state;
}
