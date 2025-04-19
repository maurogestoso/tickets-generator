import { TextLabel, useTextLabels } from "@/lib/path-b/use-labels";
import { TypographyH1 } from "./ui/typography";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { useImgUpload } from "@/lib/use-img-upload";
import { useCanvas } from "@/lib/path-b/use-canvas";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Label } from "./ui/label";
import { useState } from "react";

export function TemplateEditor() {
  const { img, readImg } = useImgUpload();

  return (
    <div className="mx-auto max-w-5xl">
      <header className="py-4">
        <TypographyH1>Template Editor</TypographyH1>
      </header>
      {!img ? (
        <Card>
          <CardContent>
            <Input
              type="file"
              id="imageUpload"
              accept="image/*"
              onChange={(e) => {
                const { files } = e.target;
                if (!files || !files.length) return;
                readImg(files[0]);
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="flex gap-4">
          <Canvas img={img} />
          <Controls />
        </div>
      )}
    </div>
  );
}

function Canvas({ img }: { img: HTMLImageElement }) {
  const { textLabels } = useTextLabels();
  const { canvasRef } = useCanvas(img, textLabels);
  return (
    <>
      <canvas ref={canvasRef} />
    </>
  );
}

function Controls() {
  const { textLabels, actions } = useTextLabels();
  const { activeTextLabel, selectActiveTextLabel } =
    useActiveTextLabel(textLabels);
  return (
    <Card className="flex-grow">
      <CardContent>
        <Accordion
          type="single"
          collapsible
          value={
            activeTextLabel !== null
              ? textLabels[activeTextLabel].name
              : undefined
          }
          onValueChange={selectActiveTextLabel}
        >
          {Object.values(textLabels).map((label) => (
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
                      actions.updateText(label.name, e.target.value);
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
                        actions.updatePosition(label.name, {
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
                        actions.updatePosition(label.name, {
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
                      actions.updateSize(label.name, e.target.valueAsNumber);
                    }}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function useActiveTextLabel(textLabels: Record<string, TextLabel>) {
  const [activeTextLabel, setActiveTextLabel] = useState<string | null>(null);

  function selectActiveTextLabel(selectedLabel: string) {
    if (textLabels[selectedLabel]) setActiveTextLabel(selectedLabel);
    else setActiveTextLabel(null);
  }

  return { activeTextLabel, selectActiveTextLabel };
}
