"use client";


import { useState } from "react";
import Navbar from "./components/Navbar";
import FileDropper from "./components/FileDropper";
import FileCardList from "./components/FileCardList";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);

  const handleFilesAdd = (newFiles: File[]) => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleFileRemove = (indexToRemove: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== indexToRemove));
  };

  return (
    <main>
      <Navbar />
      <FileDropper onFilesAdd={handleFilesAdd} />
      <FileCardList files={files} onFileRemove={handleFileRemove} />
    </main>
  );
}
