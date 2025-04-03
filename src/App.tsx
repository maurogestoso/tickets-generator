import { useEffect, useRef, useState } from "react";
import { TypographyH1, TypographyH2 } from "./components/ui/typography";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";

function App() {
  const { canvasRef, loadImage, img } = useCanvas();

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

        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>
              <TypographyH2>Controls</TypographyH2>
            </CardTitle>
          </CardHeader>
        </Card>
      </main>
    </>
  );
}

export default App;

function useCanvas() {
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  useEffect(() => {
    if (!canvasRef.current) return;
    canvasCtxRef.current = canvasRef.current.getContext("2d");
  }, [img]);

  useEffect(() => {
    if (!img) return;
    if (!canvasRef.current) return;
    if (!canvasCtxRef.current) return;

    const maxWidth = 600;
    let width = img.width;
    let height = img.height;

    if (width > maxWidth) {
      height *= maxWidth / width;
      width = maxWidth;
    }
    canvasRef.current.width = width;
    canvasRef.current.height = height;
    canvasCtxRef.current.drawImage(img, 0, 0, width, height);
  }, [img]);

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
  return { canvasRef, loadImage, img };
}
