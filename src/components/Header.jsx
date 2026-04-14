import React from "react";

function Header({
  title = "Dashboard",
  subtitle = "",
  buttonText,
  onButtonClick,
  extraActions,
}) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 page-header">
      <div>
        <h2 className="mb-1 font-weight-bold">{title}</h2>
        <p className="text-muted mb-0">{subtitle}</p>
      </div>

      <div className="d-flex align-items-center mt-3 mt-md-0">
        {extraActions}
        {buttonText && (
          <button className="btn btn-primary px-4 ml-2" onClick={onButtonClick}>
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}

export default Header;