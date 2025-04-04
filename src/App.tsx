import { TypographyH1 } from "./components/ui/typography";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { useCanvas } from "./lib/canvas";
import { useState } from "react";
import { TextLabelList } from "./components/text-label-list";

function App() {
  const { canvasRef, img, loadImage, textLabels, moveTextLabel } = useCanvas();
  const [activeTextLabel, setActiveTextLabel] = useState<number | null>(null);

  function handleLabelSelect(selectedLabel: string) {
    const idx = textLabels.state.findIndex(
      (label) => label.name === selectedLabel,
    );
    idx === -1 ? setActiveTextLabel(null) : setActiveTextLabel(idx);
  }

  return (
    <>
      <header className="mx-auto mb-4 max-w-[90%] py-4">
        <TypographyH1>Tickets Generator</TypographyH1>
      </header>
      <main className="mx-auto flex max-w-[90%] justify-center gap-8">
        {img ? (
          <canvas
            width={600}
            height={400}
            ref={canvasRef}
            onClick={(event) => {
              if (activeTextLabel === null) return;
              moveTextLabel(event, activeTextLabel);
            }}
          />
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
              <Button
                className="mb-4"
                onClick={() => {
                  setActiveTextLabel(textLabels.state.length);
                  textLabels.actions.addNewLabel();
                }}
              >
                Add text label
              </Button>
              <TextLabelList
                activeLabelIndex={activeTextLabel}
                textLabels={textLabels.state}
                onLabelSelect={handleLabelSelect}
                onLabelEditText={textLabels.actions.editLabelText}
                onLabelUpdatePosition={textLabels.actions.updateLabelPosition}
                onLabelUpdateSize={textLabels.actions.updateLabelSize}
              />
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}

export default App;
