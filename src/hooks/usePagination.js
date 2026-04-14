import { useMemo, useState } from "react";

function usePagination(items, itemsPerPage = 5) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage));

  const safeCurrentPage = currentPage > totalPages ? totalPages : currentPage;

  const paginatedData = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [items, safeCurrentPage, itemsPerPage]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const resetPage = () => {
    setCurrentPage(1);
  };

  return {
    currentPage: safeCurrentPage,
    totalPages,
    paginatedData,
    goToPage,
    resetPage,
  };
}

export default usePagination;