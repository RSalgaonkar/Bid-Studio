import React from "react";

function Pagination({
  currentPage,
  totalItems,
  itemsPerPage = 5,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

  if (totalItems === 0 || totalPages === 1) {
    return null;
  }

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="d-flex justify-content-between align-items-center flex-wrap mt-3">
      <p className="text-muted mb-2 mb-md-0">
        Page {currentPage} of {totalPages}
      </p>

      <div className="btn-group">
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {pages.map((page) => (
          <button
            key={page}
            type="button"
            className={`btn btn-sm ${
              currentPage === page ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Pagination;