import { MdPlayCircleOutline } from "react-icons/md";
import { useProcessing } from "../context/ProcessingContext";


export default function ProcessButton() {
    const {isProcessing, setIsProcessing} = useProcessing();
    return (
        <div className="flex justify-end">

            <button disabled={isProcessing} className="flex items-center rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60">
                <MdPlayCircleOutline className="mr-2 items-center" /> Process Files

            </button>
        </div>
    );
};