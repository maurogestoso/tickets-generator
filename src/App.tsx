import { TypographyH1 } from "./components/ui/typography";
import { Card, CardContent } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Button } from "./components/ui/button";
import { useCanvas } from "./lib/canvas";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./components/ui/accordion";
import { Label } from "./components/ui/label";

function App() {
  const { canvasRef, img, loadImage, textLabels, moveTextLabel } = useCanvas();
  const [activeTextLabel, setActiveTextLabel] = useState<number | null>(null);

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
              <Accordion
                type="single"
                collapsible
                value={
                  activeTextLabel !== null
                    ? textLabels.state[activeTextLabel]!.name
                    : undefined
                }
                onValueChange={(changedLabel) => {
                  const idx = textLabels.state.findIndex(
                    (label) => label.name === changedLabel,
                  );
                  idx === -1
                    ? setActiveTextLabel(null)
                    : setActiveTextLabel(idx);
                }}
              >
                {textLabels.state.map((label, i) => (
                  <AccordionItem value={label.name} key={label.name}>
                    <AccordionTrigger>{label.name}</AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <Label htmlFor={label.name}>Text</Label>
                        <Input
                          id={label.name}
                          type="text"
                          value={label.text}
                          placeholder="Type some text..."
                          autoFocus
                          onChange={(e) => {
                            textLabels.actions.editLabelText({
                              index: i,
                              text: e.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="flex gap-2">
                          <Label>X</Label>
                          <Input
                            type="number"
                            value={label.x}
                            onChange={(e) => {
                              textLabels.actions.updateLabelPosition({
                                index: i,
                                x: e.target.valueAsNumber,
                                y: label.y,
                              });
                            }}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Label>Y</Label>
                          <Input
                            type="number"
                            value={label.y}
                            onChange={(e) => {
                              textLabels.actions.updateLabelPosition({
                                index: i,
                                x: label.x,
                                y: e.target.valueAsNumber,
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Label>Size</Label>
                        <Input
                          type="number"
                          value={label.size}
                          onChange={(e) => {
                            textLabels.actions.updateLabelSize({
                              index: i,
                              size: e.target.valueAsNumber,
                            });
                          }}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        )}
      </main>
    </>
  );
}

export default App;
