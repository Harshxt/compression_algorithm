"use client";


import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import FileDropper from "./components/FileDropper";
import FileCardList from "./components/FileCardList";
import ProcessButton from "./components/ProcessButton";
import { WorkerFactory } from "./lib/ffmpegService";
import { useProcessing } from "./context/ProcessingContext";




export default function Home() {
  interface QueueItem {
    id: string;
    file: File;
    status: 'queued' | 'running' | 'completed' | 'error' | 'Canceled';
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

    const pendingItems = queueItems.filter(i => i.status === 'queued');
    if (pendingItems.length === 0) {
      setIsProcessing(false);
      return;
    }

    const CONCURRENCY_LIMIT = 2;
    (async () => {
      const queueToProcess = [...pendingItems];

      const processQueue = async () => {
        const worker = WorkerFactory.createWorker();

        while (queueToProcess.length > 0) {
          const item = queueToProcess.shift();
          if (!item) break;

          const id = item.id;

          setQueueItems(prev => prev.map(it => it.id === id ? { ...it, status: "running", progress: 0 } : it));

          try {
            const blob = await worker.compress(item.file, "medium", (pct: number) => {
              setQueueItems(prev => prev.map(it => it.id === id ? { ...it, progress: pct } : it));
            })

            const url = URL.createObjectURL(blob);
            setQueueItems(prev => prev.map(it => it.id === id ? { ...it, status: "completed", progress: 100, outputUrl: url, compressedSize: blob.size } : it));


          } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            setQueueItems(prev => prev.map(it => it.id === id ? { ...it, status: "error", error: message } : it));
            if (message == 'Canceled') {
              queueToProcess.length = 0;
              break;
            }
          }
        }
      };
     const workerLoops = Array.from({length: Math.min(CONCURRENCY_LIMIT, pendingItems.length) }, processQueue);
      await Promise.all(workerLoops);
      setIsProcessing(false);
    }
    )();
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
