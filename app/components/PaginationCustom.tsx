import { Updater } from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { classNames } from "~/tailwind";

interface PaginationCustomProps {
  currentPage: number;
  totalPage: number;
  setPageIndex: (updater: Updater<number>) => void;
  setPage: (updater: Updater<number>) => void;
}

function PaginationCustom({
  currentPage,
  totalPage,
  setPageIndex,
  setPage
}: PaginationCustomProps): JSX.Element {
  const [pages, setPages] = useState<(number | string)[]>([]);
  const [selectedPage, setSelectedPage] = useState<number>(currentPage);

  useEffect(() => {
    const generatePages = (start: number, end: number) =>
      Array.from({ length: end - start + 1 }, (_, index) => start + index);

    const pageRange = 5;
    const ellipsis = '...';

    if (totalPage <= pageRange) {
      setPages(generatePages(1, totalPage));
    } else if (currentPage <= 3) {
      setPages([...generatePages(1, 3), ellipsis, totalPage]);
    } else if (currentPage >= totalPage - 2) {
      setPages([1, ellipsis, ...generatePages(totalPage - 2, totalPage)]);
    } else {
      setPages([1, ellipsis, ...generatePages(currentPage - 1, currentPage + 1), ellipsis, totalPage]);
    }
  }, [totalPage, currentPage]);

  const handlePageChange = (page: number | string) => {
    if (typeof page === 'number') {
      setPage(page);
      setSelectedPage(page);
      setPageIndex(page - 1);
    }
  };

  const handleNextPage = () => {
    if (selectedPage < totalPage) {
      handlePageChange(selectedPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (selectedPage > 1) {
      handlePageChange(selectedPage - 1);
    }
  };

  return (
    <div className="h-10 justify-start items-start gap-1 inline-flex">
      <button
        className="w-auto h-10 p-2.5 bg-gray-200 rounded-sm flex-col justify-center items-center gap-2.5 inline-flex"
        onClick={handlePreviousPage}
        disabled={selectedPage === 1}
      >
        <div className="text-sm font-normal font-inter text-nowrap">Previous</div>
      </button>
      {pages.map((page, index) => (
        <button
          key={index}
          className={classNames(
            page === selectedPage ? "bg-sky-500" : "bg-gray-200",
            "w-10 h-10 p-2.5 bg-gray-200 rounded-sm flex-col justify-center items-center gap-2.5 inline-flex",
            typeof page === 'string' ? "cursor-default" : ""
          )}
          onClick={() => handlePageChange(page)}
          disabled={typeof page === 'string'}
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
      <button
        className="w-10 h-10 p-2.5 bg-gray-200 rounded-sm flex-col justify-center items-center gap-2.5 inline-flex"
        onClick={handleNextPage}
        disabled={selectedPage === totalPage}
      >
        <div className="text-sm font-normal font-inter">Next</div>
      </button>
    </div>
  );
}

export default PaginationCustom;