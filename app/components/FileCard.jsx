import { MdDeleteOutline } from "react-icons/md";
export default function FileCard({ item, onDelete }) {
    const {file, status, progress, originalSize, compressedSize, error} = item;
    const fileType = file.type
        ? file.type.split("/")[1]?.split("+")[0] || file.type
        : "Unknown";

         const formatSize = (bytes) => {
    if (bytes >= 1024 * 1024) {
      return (bytes / (1024 * 1024)).toFixed(2) + " MB";
    }
    return (bytes / 1024).toFixed(2) + " KB";
  };

   return (
    <div className="p-4 border rounded-lg border-gray-600 w-full bg-gray-700 flex flex-col gap-3">
      {/* File info row */}
      <div className="flex flex-row justify-between items-center">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <h3 className="text-lg font-bold">{file.name}</h3>
            <div className="m-0.5 w-fit rounded-md border border-blue-50/10 bg-blue-50/20 px-2 py-1">
              <p className="w-fit text-sm text-gray-400">Type: {fileType}</p>
            </div>
            {/* Status badge */}
            <div className={`m-0.5 w-fit rounded-md px-2 py-1 text-xs font-semibold ${
              status === 'queued' ? 'bg-yellow-500/20 border border-yellow-500/30 text-yellow-400' :
              status === 'running' ? 'bg-blue-500/20 border border-blue-500/30 text-blue-400' :
              status === 'completed' ? 'bg-green-500/20 border border-green-500/30 text-green-400' :
              status === 'error' ? 'bg-red-500/20 border border-red-500/30 text-red-400' :
              'bg-gray-500/20'
            }`}>
              {status}
            </div>
          </div>
          <p className="text-sm text-gray-400">
            Original size: {formatSize(originalSize)}
            {compressedSize && ` → Compressed: ${formatSize(compressedSize)}`}
          </p>
        </div>
        <button
          type="button"
          onClick={onDelete}
          className="px-3 py-1.5 rounded bg-red-600 text-white hover:bg-red-700 self-center"
        >
          <MdDeleteOutline />
        </button>
      </div>

      {/* Progress bar (only show when running) */}
      {status === 'running' && (
        <div className="w-full bg-gray-600 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error message */}
      {status === 'error' && error && (
        <p className="text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}