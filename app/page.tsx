"use client";


import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import FileDropper from "./components/FileDropper";
import FileCardList from "./components/FileCardList";
import ProcessButton from "./components/ProcessButton";
import { compressVideo } from "./lib/ffmpegService";
import { useProcessing } from "./context/ProcessingContext";



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
  const { isProcessing, setIsProcessing } = useProcessing();

  useEffect(() => {
    if (!isProcessing) return;
    if(!queueItems.some(i => i.status==="queued")){
      setIsProcessing(false);
      return;
    }

    const snapshot = queueItems.slice();
    (async () => {
      for (const item of snapshot) {
        if (item.status !== "queued") continue;

        const id = item.id;

        setQueueItems(prev => prev.map(it => it.id === id ? { ...it, status: "running", progress: 0 } : it));

        try {
          const blob = await compressVideo(item.file, "medium", (pct: number) => {
            setQueueItems(prev => prev.map(it => it.id === id ? { ...it, progress: pct } : it));
          });

          const url = URL.createObjectURL(blob);
          setQueueItems(prev => prev.map(it => it.id === id ? { ...it, status: "completed", progress: 100, outputUrl: url, compressedSize: blob.size } : it));
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          setQueueItems(prev => prev.map(it => it.id === id ? { ...it, status: "error", error: message } : it));
        }
      }
      setIsProcessing(false);
    })();
  }, [isProcessing]);

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

const handleFileRemove = (idToRemove: string) => {
  setQueueItems(prev => {
    const item = prev.find(i => i.id === idToRemove);
    if (item?.outputUrl) URL.revokeObjectURL(item.outputUrl);
    return prev.filter(i => i.id !== idToRemove);
  });
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
