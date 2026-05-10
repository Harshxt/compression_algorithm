"use client";


import { useState } from "react";
import Navbar from "./components/Navbar";
import FileDropper from "./components/FileDropper";
import FileCardList from "./components/FileCardList";
import ProcessButton from "./components/ProcessButton";



export default function Home() {
  interface QueueItem {
    id: string;
    file: File;
    status: 'queued' | 'running' | 'completed' | 'error';
    progress: number;
    outputUrl?: string;
    originalSize: number;
    compressedSize?: number;
    error?: string;
  }

  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);




  const handleFilesAdd = (newFiles: File[]) => {
    const newItems = newFiles.map((file) => ({
      id: (Date.now() + Math.random()).toString(),
      file,
      status: 'queued' as const,
      progress: 0,
      originalSize: file.size,
    }));
    setQueueItems((prev) => [...prev, ...newItems]);
  };

  const handleFileRemove = (indexToRemove: string) => {
    setQueueItems((prevItems) => prevItems.filter((item) => item.id !== indexToRemove));
  };

  return (
    <main className="m-4 gap-4 flex flex-col">
      <Navbar />
      <FileDropper onFilesAdd={handleFilesAdd} />
      <ProcessButton />
      <FileCardList items={queueItems} onFileRemove={handleFileRemove} />

    </main>
  );
}
