import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { ImageUpload as PathA_ImageUpload } from "./components/path-a/img-upload.tsx";
import { TemplateEditor as PathA_TemplateEditor } from "./components/path-a/template-editor.tsx";
import { DataEditor as PathA_DataEditor } from "./components/path-a/data-editor.tsx";
import { DataEditor as PathB_DataEditor } from "./components/path-b/data-editor.tsx";
import { TemplateEditor as PathB_TemplateEditor } from "./components/path-b/template-editor.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/path-b" element={<PathB_DataEditor />} />
        <Route
          path="/path-b/template-editor"
          element={<PathB_TemplateEditor />}
        />
        <Route path="/path-a" element={<PathA_ImageUpload />} />
        <Route
          path="/path-a/template-editor"
          element={<PathA_TemplateEditor />}
        />
        <Route path="/path-a/data-editor" element={<PathA_DataEditor />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
