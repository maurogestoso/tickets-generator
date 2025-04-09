import { useState } from "react";
import { type } from "arktype";
import Papa from "papaparse";

const CsvData = type({
  headers: "string[]",
  rows: "string[][]",
});

export type CsvData = typeof CsvData.infer;

export function useCsvFile() {
  const [data, setData] = useState<CsvData | null>(null);
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
  return { loadCsvFile, data };
}
