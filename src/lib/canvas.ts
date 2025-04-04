import { useEffect, useRef, useState } from "react";
import { useTextLabels } from "./text-labels";

export function useCanvas() {
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
      setImg(newImg);
    };
  }

  function moveTextLabel(
    event: React.MouseEvent<HTMLCanvasElement, MouseEvent>,
    index: number,
  ) {
    const canvas = canvasRef.current;
    const ctx = canvasCtxRef.current;
    if (!canvas || !ctx || !img) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    actions.updateLabelPosition({ x, y, index });
  }

  return {
    canvasRef,
    img,
    textLabels: { state: textLabels, actions },
    loadImage,
    moveTextLabel,
  };
}
