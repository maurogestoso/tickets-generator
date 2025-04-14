import { useEffect, useRef } from "react";
import { type TextLabel } from "./use-text-labels";

export function useCanvas(
  img: HTMLImageElement | null,
  textLabels: TextLabel[],
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);

  if (!img) return { canvasRef, canvasCtxRef };

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

  return { canvasRef, canvasCtxRef, img };
}
