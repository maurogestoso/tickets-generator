import { useNavigate } from "react-router";
import { useState } from "react";

import { useCsvData } from "@/lib/path-b/use-csv-data";
import { useTextLabels } from "@/lib/path-b/use-labels";

import { Card, CardContent, CardFooter } from "../ui/card";
import { Input } from "../ui/input";
import { TypographyH1, TypographyH2 } from "../ui/typography";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

export function DataEditor() {
  const [selectedHeaders, setSelectedHeaders] = useState(new Set<number>());
  const { data, actions: csvDataActions } = useCsvData();
  const { actions: labelsActions } = useTextLabels();
  const navigate = useNavigate();

  function createNewLabels() {
    selectedHeaders.forEach((headerIdx) => {
      const header = data?.headers[headerIdx];
      if (!header) return;
      labelsActions.addNewLabel(header, data.rows[0][headerIdx], header);
    });
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl">
        <header className="py-4">
          <TypographyH1>Data Editor</TypographyH1>
        </header>
        <Card>
          <CardContent>
            <Input
              type="file"
              accept=".csv"
              onChange={(e) => {
                const { files } = e.target;
                if (!files || files.length === 0) return;
                csvDataActions.readCsvFile(files[0]);
              }}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <header className="py-4">
        <TypographyH1>Data Editor</TypographyH1>
      </header>
      <Card>
        <CardContent>
          <TypographyH2>Example Data</TypographyH2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Key</TableHead>
                <TableHead>Example Value</TableHead>
                <TableHead>Include in template?</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.headers.map((header, headerIdx) => (
                <TableRow key={header}>
                  <TableCell>{header}</TableCell>
                  <TableCell>{data.rows[0][headerIdx]}</TableCell>
                  <TableCell>
                    <Checkbox
                      onCheckedChange={(checked) => {
                        if (checked === "indeterminate") return;

                        setSelectedHeaders((prev) => {
                          const next = new Set(prev);
                          checked
                            ? next.add(headerIdx)
                            : next.delete(headerIdx);
                          return next;
                        });
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            onClick={() => {
              createNewLabels();
              navigate("/path-b/template-editor");
            }}
          >
            To Template Editor
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
