import { MdDeleteOutline } from "react-icons/md";
export default function FileCard({ file, onDelete }) {
    const fileType = file.type
        ? file.type.split("/")[1]?.split("+")[0] || file.type
        : "Unknown";

    return (

        <div className="p-4 border rounded-lg border-gray-600 w-full bg-gray-700 flex flex-row justify-between items-center">
            <div>
                <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-lg font-bold">{file.name}</h3>
                    <div className="m-0.5 w-fit rounded-md border border-blue-50/10 bg-blue-50/20 px-2 py-1">
                        <p className="w-fit text-sm text-gray-400">Type: {fileType}</p>
                    </div>
                </div>
                <p className="text-sm text-gray-400">Size: {(file.size / 1024).toFixed(2)} KB</p>

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