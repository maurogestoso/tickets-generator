import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useImgUpload } from "@/lib/use-img-upload";
import { TypographyH1 } from "./ui/typography";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { TextLabelList } from "./text-label-list";
import { TextLabel, useTextLabels } from "@/lib/text-labels";

export function TemplateEditor() {
  const navigate = useNavigate();
  const { img } = useImgUpload();
  if (!img) {
    navigate("/");
    return null;
  }
  const { textLabels, actions } = useTextLabels();
  const { canvasRef } = useEditorCanvas(img, textLabels);
  const { activeTextLabel, setActiveTextLabel, selectActiveTextLabel } =
    useActiveTextLabel(textLabels);

  return (
    <>
      <TypographyH1>Template Editor</TypographyH1>
      <div className="flex">
        <canvas ref={canvasRef} />
        <Card className="w-[400px]">
          <CardContent>
            <Button
              className="mb-4"
              onClick={() => {
                setActiveTextLabel(textLabels.length);
                actions.addNewLabel();
              }}
            >
              Add text label
            </Button>
            <TextLabelList
              activeLabelIndex={activeTextLabel}
              textLabels={textLabels}
              onLabelSelect={selectActiveTextLabel}
              onLabelEditText={actions.editLabelText}
              onLabelUpdatePosition={actions.updateLabelPosition}
              onLabelUpdateSize={actions.updateLabelSize}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function useEditorCanvas(img: HTMLImageElement, textLabels: TextLabel[]) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  // Set up the canvas context
  useEffect(() => {
    if (!canvasRef.current) return;
    canvasCtxRef.current = canvasRef.current.getContext("2d");
  }, []);

  // Load the image and set the canvas size
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvasCtxRef.current;
    if (!canvas || !ctx) return;

    const maxWidth = 600;
    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
      height *= maxWidth / width;
      width = maxWidth;
    }
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, width, height);
  }, [img]);

  // Redraw the canvas when the text labels change
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvasCtxRef.current;
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    textLabels.forEach((label) => {
      ctx.font = `${label.size}px Arial`;
      ctx.fillStyle = "white";
      ctx.fillText(label.text, label.x, label.y);
    });
  }, [textLabels]);

  return { canvasRef, canvasCtxRef };
}

function useActiveTextLabel(textLabels: TextLabel[]) {
  const [activeTextLabel, setActiveTextLabel] = useState<number | null>(null);

  function selectActiveTextLabel(selectedLabel: string) {
    const idx = textLabels.findIndex((label) => label.name === selectedLabel);
    if (idx === -1) setActiveTextLabel(null);
    else setActiveTextLabel(idx);
  }

  return { activeTextLabel, setActiveTextLabel, selectActiveTextLabel };
}
