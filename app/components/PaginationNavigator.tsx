import { Updater } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { classNames } from "~/tailwind";

interface PaginationNavigatorProps {
	currentPage: number;
	totalPage: number;
	setPageIndex: (updater: Updater<number>) => void;
}

function PaginationNavigator({
	currentPage,
	totalPage,
	setPageIndex,
}: PaginationNavigatorProps): JSX.Element {
	const [pages, setPages] = useState<number[]>([]);
	const [selectedPage, setSelectedPage] = useState<number>(currentPage);

	useEffect(() => {
		const generatePages = (start: number, end: number) =>
			Array.from({ length: end - start + 1 }, (_, index) => start + index);

		const pageRange = totalPage >= 5 ? 5 : totalPage;

		if (totalPage === 0) {
			setPages(generatePages(1, 1));
		} else if (totalPage < pageRange) {
			setPages(generatePages(1, totalPage));
		} else if (currentPage <= 3) {
			setPages(generatePages(1, pageRange));
		} else if (currentPage >= totalPage - 2) {
			setPages(generatePages(totalPage - pageRange + 1, totalPage));
		} else {
			setPages(generatePages(currentPage - 2, currentPage + 2));
		}
	}, [totalPage, currentPage]);

	const handlePageChange = (page: number) => {
		setSelectedPage(page);
		setPageIndex(page);
	};

	return (
		<div className="h-10 justify-start items-start gap-1 inline-flex">
			{pages.map((page) => (
				<button
					key={page}
					className={classNames(
						page === selectedPage ? "bg-sky-500" : "bg-gray-200",
						"w-10 h-10 p-2.5 bg-gray-200 rounded-sm flex-col justify-center items-center gap-2.5 inline-flex",
					)}
					onClick={() => handlePageChange(page)}
				>
					<div
						className={classNames(
							page === selectedPage ? "text-white" : "text-black",
							"text-sm font-normal font-inter",
						)}
					>
						{page}
					</div>
				</button>
			))}
		</div>
	);
}

export default PaginationNavigator;
