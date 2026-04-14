import React from "react";

function Header({
  title,
  subtitle,
  buttonText,
  onButtonClick,
  extraActions,
  onOpenCommandPalette,
}) {
  return (
    <div className="d-flex justify-content-between align-items-start flex-wrap mb-4">
      <div className="mb-3">
        <h2 className="font-weight-bold mb-1">{title}</h2>
        <p className="text-muted mb-0">{subtitle}</p>
      </div>

      <div className="d-flex align-items-center flex-wrap" style={{ gap: "10px" }}>
        {extraActions}

        {onOpenCommandPalette ? (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={onOpenCommandPalette}
          >
            Search / Commands
            <span className="ms-2 badge badge-light border text-muted">
              Ctrl + K
            </span>
          </button>
        ) : null}

        {buttonText ? (
          <button type="button" className="btn btn-primary" onClick={onButtonClick}>
            {buttonText}
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default Header;