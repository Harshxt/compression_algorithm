"use client";

import { useContext, createContext, useState } from "react";

const ProcessingContext = createContext(undefined);


export function ProcessingProvider({ children }) {
    const [isProcessing, setIsProcessing] = useState(false);


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