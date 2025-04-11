import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";

import { ImageUpload } from "./components/img-upload.tsx";
import { TemplateEditor } from "./components/template-editor.tsx";

import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ImageUpload />} />
        <Route path="/template-editor" element={<TemplateEditor />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
