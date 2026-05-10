import FileCard from './FileCard'

export default function FileCardList({ items, onFileRemove }) {
	if (!items || items.length === 0) {
		return (
			<div className="rounded-lg border border-gray-700 bg-gray-800 p-4 text-gray-400">
				No items selected yet.
			</div>
		);
	}



	return (
		<section className="grid gap-3">
			{items.map((item) => (
				<FileCard
					key={item.id}
					item={item}
					onDelete={() => onFileRemove(item.id)}
				/>
			))}
		</section>
	);
}
