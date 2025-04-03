import { useEffect, useReducer, useRef, useState } from "react";
import { TypographyH1 } from "./components/ui/typography";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";

function App() {
  const { canvasRef, img, loadImage, textLabels } = useCanvas();

  return (
    <>
      <header className="mx-auto mb-4 max-w-[90%] py-4">
        <TypographyH1>Tickets Generator</TypographyH1>
      </header>
      <main className="mx-auto flex max-w-[90%] justify-center gap-8">
        {img ? (
          <canvas width={600} height={400} ref={canvasRef} />
        ) : (
          <Card className="flex h-[400px] w-[600px] items-center justify-center self-stretch">
            <CardContent>
              <Input
                type="file"
                id="imageUpload"
                accept="image/*"
                onChange={loadImage}
              />
            </CardContent>
          </Card>
        )}
        {img && (
          <Card className="w-[400px]">
            <CardContent>
              <Button className="mb-4" onClick={textLabels.actions.addNewLabel}>
                Add text label
              </Button>
              {textLabels.state.map((label, i) => (
                <div className="mb-4">
                  <p className="mb-2 font-bold">{label.name}</p>
                  <Input
                    type="text"
                    value={label.text}
                    onChange={(e) => {
                      textLabels.actions.editLabelText({
                        index: i,
                        text: e.target.value,
                      });
                    }}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}

export default App;

function useCanvas() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const { textLabels, actions } = useTextLabels();

  useEffect(() => {
    if (!canvasRef.current) return;
    canvasCtxRef.current = canvasRef.current.getContext("2d");
  }, [img]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvasCtxRef.current;
    if (!img) return;
    if (!canvas) return;
    if (!ctx) return;

    const maxWidth = 600;
    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
      height *= maxWidth / width;
      width = maxWidth;
    }
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(img, 0, 0, width, height);
  }, [img]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvasCtxRef.current;
    if (!img) return;
    if (!canvas) return;
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    textLabels.forEach((label) => {
      ctx.font = `${label.size}px Arial`;
      ctx.fillStyle = "white";
      ctx.fillText(label.text, label.x, label.y);
    });
  }, [textLabels]);

  function loadImage(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const newImg = new Image();
      newImg.src = e.target?.result as string;

      console.log("🚀 ~ loadImage ~ newImg:", newImg);

      setImg(newImg);
    };
  }

  return {
    canvasRef,
    img,
    textLabels: { state: textLabels, actions },
    loadImage,
  };
}

type TextLabel = {
  name: string;
  text: string;
  x: number;
  y: number;
  size: number;
};

type Action =
  | { type: "ADD_NEW_LABEL" }
  | { type: "EDIT_LABEL_TEXT"; payload: { index: number; text: string } };

function useTextLabels() {
  const [textLabels, dispatch] = useReducer(function (
    state: TextLabel[],
    action: Action,
  ) {
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
  }, []);
  return {
    textLabels,
    actions: {
      addNewLabel: () => dispatch({ type: "ADD_NEW_LABEL" }),
      editLabelText: ({ index, text }: { index: number; text: string }) =>
        dispatch({ type: "EDIT_LABEL_TEXT", payload: { index, text } }),
    },
  };
}
