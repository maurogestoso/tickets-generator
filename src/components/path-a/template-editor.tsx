import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useImgUpload } from "@/lib/use-img-upload";
import { TypographyH1 } from "../ui/typography";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { TextLabel, useTextLabels } from "@/lib/use-text-labels";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useCanvas } from "@/lib/use-canvas";

export function TemplateEditor() {
  const navigate = useNavigate();
  const { img } = useImgUpload();
  const { textLabels, actions } = useTextLabels();
  const { canvasRef } = useCanvas(img, textLabels);
  const { activeTextLabel, setActiveTextLabel, selectActiveTextLabel } =
    useActiveTextLabel(textLabels);

  useEffect(() => {
    if (!img) navigate("/");
  }, [img]);

  return (
    <>
      <TypographyH1>Template Editor</TypographyH1>
      <div className="flex">
        <canvas ref={canvasRef} />
        <Card className="flex w-[400px] flex-col">
          <CardContent className="flex-grow">
            <Button
              className="mb-4"
              onClick={() => {
                setActiveTextLabel(textLabels.length);
                actions.addNewLabel();
              }}
            >
              Add text label
            </Button>
            <Accordion
              type="single"
              collapsible
              value={
                activeTextLabel !== null
                  ? textLabels[activeTextLabel]!.name
                  : undefined
              }
              onValueChange={selectActiveTextLabel}
            >
              {textLabels.map((label, index) => (
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
                          actions.editLabelText(index, e.target.value);
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
                            actions.updateLabelPosition(index, {
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
                            actions.updateLabelPosition(index, {
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
                          actions.updateLabelSize(
                            index,
                            e.target.valueAsNumber,
                          );
                        }}
                      />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
          <CardFooter>
            <Link to="/path-a/data-editor">
              <Button variant="secondary" className="w-full">
                To Data Editor
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </>
  );
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
