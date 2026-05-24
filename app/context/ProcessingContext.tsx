"use client";

import { useContext, createContext, useState } from "react";


type ProcessingContextValue = {
    isProcessing: boolean;
    setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
}
const ProcessingContext = createContext<ProcessingContextValue | undefined>(undefined);


export function ProcessingProvider({ children }: {children: React.ReactNode}) {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);


    return (
        <ProcessingContext.Provider value={{ isProcessing, setIsProcessing }}>
            {children}
        </ProcessingContext.Provider>
    )


}

export function useProcessing() {
    const context = useContext(ProcessingContext);

    if (!context) {
        throw new Error("useProcessing must be used with ProcessingProvider");
    }
    return context;
}