import FileCard from "./FileCard";

export default function FileCardList({ files, onFileRemove }) {
	if (!files || files.length === 0) {
		return (
			<div className="rounded-lg border border-gray-700 bg-gray-800 p-4 text-gray-400">
				No files selected yet.
			</div>
		);
	}



	return (
		<section className="grid gap-3">
			{files.map((file, index) => (
				<FileCard
					key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
					file={file}
					onDelete={() => onFileRemove(index)}
				/>
			))}
		</section>
	);
}
