import React from "react";

function Header({ title = "Dashboard", subtitle = "", buttonText, onButtonClick }) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 page-header">
      <div>
        <h2 className="mb-1 font-weight-bold">{title}</h2>
        <p className="text-muted mb-0">{subtitle}</p>
      </div>

      {buttonText && (
        <button className="btn btn-primary px-4 mt-3 mt-md-0" onClick={onButtonClick}>
          {buttonText}
        </button>
      )}
    </div>
  );
}

export default Header;