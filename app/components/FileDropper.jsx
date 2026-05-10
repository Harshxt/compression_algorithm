'use client';


import { useRef } from "react";
import { useProcessing } from "../context/ProcessingContext";



export default function FileDropper({ onFilesAdd }) {
    const fileInputRef = useRef(null);
    const { isProcessing } = useProcessing();
    const openPicker = () => {
        fileInputRef.current?.click();
    };

    const handleFiles = (selectedFiles) => {
        const picked = Array.from(selectedFiles ?? []);
        if (picked.length > 0 && typeof onFilesAdd === "function") {
            onFilesAdd(picked);
        }

        picked.forEach(async (file) => {
            console.log('Name:', file.name);
            console.log('Size:', file.size);
            console.log('Type:', file.type);

            const buffer = await file.arrayBuffer();
            console.log('Buffer:', buffer.byteLength);
        });
    };

    const onInputChange = (e) => {
        handleFiles(e.target.files);
        e.target.value = "";
    };

    const onDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const onDragOver = (e) => {
        e.preventDefault();
    }

    return (
        <div disabled={isProcessing} className="min-h-100 p-4 bg-gray-800 rounded-lg shadow-lg ring-1 ring-white/10 flex items-center justify-center align-center ">
            <input disabled={isProcessing}
                ref={fileInputRef} type="file" className="hidden" onChange={onInputChange} multiple />
            {isProcessing ? (
                <div className="p-4 border rounded-lg border-gray-700 w-full max-w-md bg-gray-900/30 cursor-not-allowed opacity-70">
                    <h2 className="text-2xl font-bold mb-4 text-center">File Upload Disabled</h2>
                    <p className="text-gray-400 text-center">Please wait until processing is complete.</p>
                </div>
            ) : (
                <div role="button" tabIndex={0} onClick={openPicker} onDrop={onDrop} onDragOver={onDragOver} onKeyDown={(e) => e.key === 'Enter' && openPicker()}>
                    <div className="p-4 border rounded-lg border-gray-600  w-full max-w-md hover:border-gray-400 transition-colors cursor-pointer hover:bg-gray-900/30">
                        <h2 className="text-2xl font-bold mb-4 text-center">Drag and Drop Your Files Here</h2>
                        <p className="text-gray-400 text-center">or click to select files</p>
                    </div>
                </div>
            )}
        </div>
    );
}