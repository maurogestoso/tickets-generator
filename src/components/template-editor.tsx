import { useImg } from "@/lib/use-img-upload";
import { TypographyH1 } from "./ui/typography";
import { useNavigate } from "react-router";
import { useEffect, useRef } from "react";

export function TemplateEditor() {
  const navigate = useNavigate();
  const { img } = useImg();
  if (!img) {
    navigate("/");
    return null;
  }
  const { canvasRef } = useEditorCanvas(img);

  return (
    <>
      <TypographyH1>Template Editor</TypographyH1>
      <canvas ref={canvasRef} />
    </>
  );
}

function useEditorCanvas(img: HTMLImageElement) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    canvasCtxRef.current = canvasRef.current.getContext("2d");
  }, [img]);

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
    ctx.drawImage(img, 0, 0, width, height);
  }, [img]);

  return { canvasRef, canvasCtxRef };
}
