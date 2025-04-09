import { TextLabel } from "@/lib/text-labels";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { CsvData } from "@/lib/csv-file";

type Props = {
  activeLabelIndex: number | null;
  textLabels: TextLabel[];
  onLabelSelect: (selectedLabel: string) => void;
  onLabelEditText: (params: { index: number; text: string }) => void;
  onLabelUpdatePosition: (params: {
    index: number;
    x: number;
    y: number;
  }) => void;
  onLabelUpdateSize: (params: { index: number; size: number }) => void;
  csvData: CsvData | null;
};

export function TextLabelList({
  activeLabelIndex,
  textLabels,
  onLabelSelect,
  onLabelEditText,
  onLabelUpdatePosition,
  onLabelUpdateSize,
  csvData,
}: Props) {
  if (csvData) console.log("🚀 ~ csvData:", csvData);

  return (
    <Accordion
      type="single"
      collapsible
      value={
        activeLabelIndex !== null
          ? textLabels[activeLabelIndex]!.name
          : undefined
      }
      onValueChange={onLabelSelect}
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
                  onLabelEditText({ index, text: e.target.value });
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
                    onLabelUpdatePosition({
                      index,
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
                    onLabelUpdatePosition({
                      index,
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
                  onLabelUpdateSize({
                    index: index,
                    size: e.target.valueAsNumber,
                  });
                }}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
