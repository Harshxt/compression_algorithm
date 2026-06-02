import { MdPlayCircleOutline } from "react-icons/md";
import { useProcessing } from "../context/ProcessingContext";
import LoadingIcon from "./LoadingIcon";
import { MdCancel } from "react-icons/md";

export default function ProcessButton() {
    const {isProcessing, setIsProcessing} = useProcessing();

    const handleProcessClick = () => {
        setIsProcessing(!isProcessing);
    };
    return (
        <div className="flex justify-end gap-2">
            <button className="flex items-center rounded-md bg-red-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60">
                <MdCancel className="mr-2 items-center" /> Cancel
            </button>
            <button onClick={handleProcessClick} disabled={isProcessing} className="flex items-center rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                {isProcessing ? (
                    <LoadingIcon className="mr-2 items-center" />
                ) : (
                    <MdPlayCircleOutline className="mr-2 items-center" />
                )}
                {isProcessing ? " Processing" : "Process Files"}
            </button>
        </div>
    );
};