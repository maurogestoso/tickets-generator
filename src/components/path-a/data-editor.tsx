import { useEffect, useState } from "react";
import { TypographyH1, TypographyH2 } from "../ui/typography";
import { type } from "arktype";
import Papa from "papaparse";
import { useNavigate } from "react-router";
import { useImgUpload } from "@/lib/use-img-upload";
import { useTextLabels } from "@/lib/use-text-labels";
import { useCanvas } from "@/lib/use-canvas";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Combobox } from "../ui/combobox";
import { Button } from "../ui/button";
import JSZip from "jszip";

export function DataEditor() {
  const navigate = useNavigate();
  const { img } = useImgUpload();
  const { textLabels, actions } = useTextLabels();
  const { canvasRef, canvasCtxRef } = useCanvas(img, textLabels);
  const { loadCsvFile, data, setLinkHeaderToLabel, linksLabelToHeader } =
    useCsvUpload();

  useEffect(() => {
    if (!img) navigate("/");
  }, [img]);

  const options =
    textLabels.map((label) => ({
      value: label.name,
      label: label.name,
    })) || [];

  function selectLabelLink(textLabelName: string, headerIdx: number) {
    // TODO: handle case ""
    if (!data) return;
    const labelIdx = textLabels.findIndex(
      (label) => label.name === textLabelName,
    );
    actions.editLabelText(labelIdx, data.rows[0][headerIdx]);
    setLinkHeaderToLabel(headerIdx, labelIdx);
  }

  async function downloadAll() {
    const zip = new JSZip();
    const ctx = canvasCtxRef.current;
    const canvas = canvasRef.current;
    if (!ctx || !canvas || !img) return;

    data?.rows.forEach(async (row) => {
      const labels = textLabels.map((textLabel, labelIdx) => {
        const headerIdx = linksLabelToHeader[labelIdx];
        return { ...textLabel, text: row[headerIdx] };
      });

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      labels.forEach((label) => {
        ctx.font = `${label.size}px Arial`;
        ctx.fillStyle = "white";
        ctx.fillText(label.text, label.x, label.y);
      });

      const imgData = canvasRef.current!.toDataURL("image/jpeg");
      const [, base64] = imgData.split("data:image/jpeg;base64,");

      zip.file(`${row[0]}-${row[1]}.jpeg`, base64, {
        base64: true,
      });
    });

    zip.generateAsync({ type: "blob" }).then(async function (blob) {
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: "images.zip",
        types: [
          {
            description: "Images",
            accept: {
              "application/zip": [".zip"],
            },
          },
        ],
      });

      const writable = await fileHandle.createWritable();
      await writable.write(blob);
      await writable.close();
    });
  }

  return (
    <>
      <TypographyH1>Data Editor</TypographyH1>
      <div className="flex">
        <canvas ref={canvasRef} />
        <Card className="flex flex-grow flex-col">
          <CardContent className="flex-grow">
            {data ? (
              <>
                <TypographyH2>Example Data</TypographyH2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Key</TableHead>
                      <TableHead>Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.headers.map((header, headerIdx) => (
                      <TableRow>
                        <TableCell>{header}</TableCell>
                        <TableCell>{data.rows[0][headerIdx]}</TableCell>
                        <TableCell>
                          <Combobox
                            options={options}
                            placeholder="Link to text label..."
                            onChange={(labelName) =>
                              selectLabelLink(labelName, headerIdx)
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : (
              <Input type="file" accept=".csv" onChange={loadCsvFile} />
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={downloadAll}>Download All</Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

const CsvData = type({
  headers: "string[]",
  rows: "string[][]",
});

type CsvData = typeof CsvData.infer;

export function useCsvUpload() {
  const [data, setData] = useState<CsvData | null>(null);
  const [links, setLinks] = useState<Record<number, number>>({});
  const [linksLabelToHeader, setLinksLabelToHeader] = useState<
    Record<number, number>
  >({});

  function loadCsvFile(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files) return;

    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsText(file);
    reader.onload = (e) => {
      if (!e.target || e.target.result === null) return;
      const parsedFile = Papa.parse(e.target.result as string);

      const result = CsvData({
        headers: parsedFile.data[0],
        rows: parsedFile.data.slice(1),
      });

      if (result instanceof type.errors) {
        console.error(result.summary);
      } else {
        setData(result);
      }
    };
  }

  function setLinkHeaderToLabel(headerIdx: number, labelIdx: number) {
    setLinks({ ...links, [headerIdx]: labelIdx });
    setLinksLabelToHeader({ ...linksLabelToHeader, [labelIdx]: headerIdx });
  }

  return {
    loadCsvFile,
    data,
    linksLabelToHeaderIdx: links,
    setLinkHeaderToLabel,
    linksLabelToHeader,
  };
}
