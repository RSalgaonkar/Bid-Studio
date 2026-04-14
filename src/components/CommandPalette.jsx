import React, { useEffect, useMemo, useRef, useState } from "react";

function CommandPalette({
  isOpen,
  onClose,
  setActivePage,
  toggleTheme,
  theme,
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const commands = useMemo(() => {
    return [
      {
        id: "go-dashboard",
        label: "Go to Dashboard",
        description: "Open dashboard overview",
        group: "Navigation",
        keywords: ["dashboard home analytics overview"],
        action: () => {
          setActivePage("dashboard");
          onClose();
        },
      },
      {
        id: "go-bids",
        label: "Go to Bids",
        description: "Open bids management",
        group: "Navigation",
        keywords: ["bids proposals pipeline"],
        action: () => {
          setActivePage("bids");
          onClose();
        },
      },
      {
        id: "go-clients",
        label: "Go to Clients",
        description: "Open clients section",
        group: "Navigation",
        keywords: ["clients customer companies"],
        action: () => {
          setActivePage("clients");
          onClose();
        },
      },
      {
        id: "go-analytics",
        label: "Go to Analytics",
        description: "Open analytics page",
        group: "Navigation",
        keywords: ["analytics reports charts insights"],
        action: () => {
          setActivePage("analytics");
          onClose();
        },
      },
      {
        id: "new-bid",
        label: "Create New Bid",
        description: "Jump to bids page and create a new bid",
        group: "Actions",
        keywords: ["new create add bid proposal"],
        action: () => {
          setActivePage("bids");
          onClose();
        },
      },
      {
        id: "new-client",
        label: "Add New Client",
        description: "Jump to clients page",
        group: "Actions",
        keywords: ["new create add client customer"],
        action: () => {
          setActivePage("clients");
          onClose();
        },
      },
      {
        id: "toggle-theme",
        label: theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode",
        description: "Toggle application theme",
        group: "Preferences",
        keywords: ["theme dark light mode appearance"],
        action: () => {
          toggleTheme();
          onClose();
        },
      },
      {
        id: "close-palette",
        label: "Close Command Palette",
        description: "Dismiss this dialog",
        group: "General",
        keywords: ["close escape dismiss cancel"],
        action: () => {
          onClose();
        },
      },
    ];
  }, [setActivePage, toggleTheme, theme, onClose]);

  const filteredCommands = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return commands;

    return commands.filter((command) => {
      const haystack = [
        command.label,
        command.description,
        command.group,
        ...(command.keywords || []),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedQuery);
    });
  }, [commands, query]);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => {
        inputRef.current.focus();
      }, 10);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedIndex >= filteredCommands.length) {
      setSelectedIndex(0);
    }
  }, [filteredCommands, selectedIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCommands.length - 1 ? prev + 1 : 0
        );
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCommands.length - 1
        );
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const selectedCommand = filteredCommands[selectedIndex];
        if (selectedCommand) {
          selectedCommand.action();
        }
      }

      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [filteredCommands, selectedIndex, isOpen, onClose]);

  const groupedCommands = useMemo(() => {
    return filteredCommands.reduce((acc, command) => {
      if (!acc[command.group]) {
        acc[command.group] = [];
      }
      acc[command.group].push(command);
      return acc;
    }, {});
  }, [filteredCommands]);

  if (!isOpen) return null;

  let runningIndex = -1;

  return (
    <>
      <div
        className="command-palette-backdrop"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15, 23, 42, 0.45)",
          backdropFilter: "blur(6px)",
          zIndex: 1080,
        }}
      />

      <div
        className="command-palette-wrapper"
        style={{
          position: "fixed",
          top: "10vh",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(720px, calc(100% - 24px))",
          zIndex: 1090,
        }}
      >
        <div
          className="card border-0 shadow-lg overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
          style={{
            borderRadius: "18px",
          }}
        >
          <div
            className="border-bottom px-3 px-md-4 py-3 d-flex align-items-center"
            style={{ gap: "12px" }}
          >
            <span className="text-muted" style={{ fontSize: "1.1rem" }}>
              ⌘
            </span>

            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Search pages, actions, and shortcuts..."
              className="form-control border-0 shadow-none px-0"
              style={{
                fontSize: "1rem",
                background: "transparent",
              }}
            />

            <span className="badge badge-light border text-muted">ESC</span>
          </div>

          <div
            className="command-palette-results"
            style={{
              maxHeight: "420px",
              overflowY: "auto",
            }}
          >
            {filteredCommands.length === 0 ? (
              <div className="p-4 text-center text-muted">
                No commands found for “{query}”
              </div>
            ) : (
              Object.entries(groupedCommands).map(([groupName, items]) => (
                <div key={groupName} className="py-2">
                  <div className="px-4 pt-2 pb-1 text-uppercase text-muted small font-weight-bold">
                    {groupName}
                  </div>

                  {items.map((command) => {
                    runningIndex += 1;
                    const isSelected = runningIndex === selectedIndex;

                    return (
                      <button
                        key={command.id}
                        type="button"
                        onClick={command.action}
                        onMouseEnter={() => setSelectedIndex(runningIndex)}
                        className="w-100 text-left border-0 bg-transparent px-4 py-3"
                        style={{
                          backgroundColor: isSelected ? "#f8f9fa" : "transparent",
                          transition: "background-color 0.15s ease",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <div className="font-weight-bold text-dark">
                              {command.label}
                            </div>
                            <div className="text-muted small">
                              {command.description}
                            </div>
                          </div>

                          <span className="badge badge-light border text-muted">
                            ↵
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          <div className="border-top px-4 py-2 d-flex justify-content-between flex-wrap small text-muted">
            <span>Use ↑ ↓ to navigate</span>
            <span>Press Enter to run</span>
            <span>Ctrl + K to toggle</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default CommandPalette;