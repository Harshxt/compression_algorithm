import { MdDeleteOutline } from "react-icons/md";
export default function FileCard({ file, onDelete }) {
    const fileType = file.type
        ? file.type.split("/")[1]?.split("+")[0] || file.type
        : "Unknown";

    return (

        <div className="p-4 border rounded-lg border-gray-600 w-full bg-gray-700 flex flex-row justify-between items-center">
            <div>
                <h3 className="text-lg font-bold mb-2">{file.name}</h3>
                <p className="text-sm text-gray-400">Size: {(file.size / 1024).toFixed(2)} KB</p>
                <p className="text-sm text-gray-400">Type: {fileType}</p>

            </div>
            <button
                type="button"
                onClick={onDelete}
                className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 self-center"
            >
                <MdDeleteOutline />
            </button>

        </div>
    );
}