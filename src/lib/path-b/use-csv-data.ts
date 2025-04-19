import { type } from "arktype";
import Papa from "papaparse";
import { create } from "zustand";

const ArkCsvData = type({
  headers: "string[]",
  rows: "string[][]",
});

type CsvData = typeof ArkCsvData.infer;

type CsvActions = {
  readCsvFile: (file: File) => void;
};

export const useCsvData = create<
  { data: CsvData | null } & { actions: CsvActions }
>()((set) => ({
  data: null,
  actions: {
    readCsvFile: (file: File) => {
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (e) => {
        if (!e.target || e.target.result === null) return;
        const parsedFile = Papa.parse(e.target.result as string);

        const result = ArkCsvData({
          headers: parsedFile.data[0],
          rows: parsedFile.data.slice(1),
        });

        if (result instanceof type.errors) {
          throw result.summary;
        }

        set({ data: result });
      };
    },
  },
}));
