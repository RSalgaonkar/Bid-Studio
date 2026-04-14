import React, { useEffect, useMemo, useRef, useState } from "react";
import BidTableFilters from "./BidTableFilters";
import "./BidTable.css";

const sampleBids = [
  {
    id: 1,
    title: "Website Redesign for Fintech Startup",
    client: "NovaPay",
    amount: 85000,
    status: "pending",
    deadline: "2026-04-25",
    createdAt: "2026-04-12",
  },
  {
    id: 2,
    title: "Mobile App UI Revamp",
    client: "UrbanFleet",
    amount: 120000,
    status: "approved",
    deadline: "2026-04-18",
    createdAt: "2026-04-10",
  },
  {
    id: 3,
    title: "Admin Dashboard Development",
    client: "CloudMint",
    amount: 64000,
    status: "rejected",
    deadline: "2026-05-03",
    createdAt: "2026-04-08",
  },
  {
    id: 4,
    title: "E-commerce Checkout Optimization",
    client: "StyleCart",
    amount: 97000,
    status: "pending",
    deadline: "2026-04-20",
    createdAt: "2026-04-11",
  },
  {
    id: 5,
    title: "Booking Portal Frontend Build",
    client: "TripNest",
    amount: 142000,
    status: "approved",
    deadline: "2026-04-16",
    createdAt: "2026-04-14",
  },
  {
    id: 6,
    title: "Hotel Reservation Dashboard",
    client: "StayLoom",
    amount: 78000,
    status: "pending",
    deadline: "2026-04-28",
    createdAt: "2026-04-09",
  },
  {
    id: 7,
    title: "Fleet Tracking Panel",
    client: "RoadAxis",
    amount: 165000,
    status: "approved",
    deadline: "2026-04-30",
    createdAt: "2026-04-13",
  },
  {
    id: 8,
    title: "Vendor Management Portal",
    client: "SupplyGrid",
    amount: 91000,
    status: "rejected",
    deadline: "2026-04-21",
    createdAt: "2026-04-07",
  },
  {
    id: 9,
    title: "Real Estate Listing Frontend",
    client: "BrickAura",
    amount: 132000,
    status: "approved",
    deadline: "2026-04-19",
    createdAt: "2026-04-06",
  },
  {
    id: 10,
    title: "Insurance Quote Builder",
    client: "SurePath",
    amount: 88000,
    status: "pending",
    deadline: "2026-04-24",
    createdAt: "2026-04-05",
  },
  {
    id: 11,
    title: "Learning Platform Dashboard",
    client: "SkillForge",
    amount: 111000,
    status: "approved",
    deadline: "2026-05-01",
    createdAt: "2026-04-04",
  },
  {
    id: 12,
    title: "Food Delivery Merchant Panel",
    client: "QuickDish",
    amount: 69000,
    status: "rejected",
    deadline: "2026-04-22",
    createdAt: "2026-04-03",
  },
];

const PAGE_SIZE = 5;

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getDaysLeft(date) {
  const now = new Date();
  const target = new Date(date);
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Expired";
  if (diff === 0) return "Today";
  if (diff === 1) return "1 day left";
  return `${diff} days left`;
}

function getStatusClass(status) {
  return `bid-status-badge ${status}`;
}

function BidTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [page, setPage] = useState(1);
  const [openMenuId, setOpenMenuId] = useState(null);
  const menuRef = useRef(null);

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setSortBy("latest");
    setPage(1);
  };

  useEffect(() => {
    setPage(1);
  }, [searchTerm, statusFilter, sortBy]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredBids = useMemo(() => {
    let filtered = [...sampleBids];

    if (searchTerm.trim()) {
      const query = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (bid) =>
          bid.title.toLowerCase().includes(query) ||
          bid.client.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((bid) => bid.status === statusFilter);
    }

    switch (sortBy) {
      case "amountHigh":
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case "amountLow":
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      case "deadlineSoon":
        filtered.sort(
          (a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        );
        break;
      case "titleAZ":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "latest":
      default:
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    return filtered;
  }, [searchTerm, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredBids.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedBids = filteredBids.slice(startIndex, startIndex + PAGE_SIZE);
  const showingFrom = filteredBids.length === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(startIndex + PAGE_SIZE, filteredBids.length);

  const handleSortHeader = (type) => {
    const map = {
      latest: "latest",
      amount: sortBy === "amountHigh" ? "amountLow" : "amountHigh",
      deadline: "deadlineSoon",
      title: "titleAZ",
    };

    setSortBy(map[type]);
  };

  const getAriaSort = (column) => {
    if (column === "title" && sortBy === "titleAZ") return "ascending";
    if (column === "amount" && sortBy === "amountHigh") return "descending";
    if (column === "amount" && sortBy === "amountLow") return "ascending";
    if (column === "deadline" && sortBy === "deadlineSoon") return "ascending";
    if (column === "createdAt" && sortBy === "latest") return "descending";
    return "none";
  };

  return (
    <div className="bid-table-page">
      <BidTableFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        resultCount={filteredBids.length}
        totalCount={sampleBids.length}
        clearFilters={clearFilters}
      />

      <section className="bid-table-card">
        <div className="bid-table-card-top">
          <div>
            <p className="bid-table-kicker">Current results</p>
            <h3 className="bid-table-title">Submitted Bids</h3>
          </div>

          <div className="bid-table-meta">
            Showing {showingFrom}-{showingTo} of {filteredBids.length}
          </div>
        </div>

        <div className="bid-table-wrap">
          <table className="smart-bid-table">
            <caption className="sr-only">
              Bid results table with sortable columns for project, amount, and deadline.
            </caption>
            <thead>
              <tr>
                <th scope="col" aria-sort={getAriaSort("title")}>
                  <button
                    type="button"
                    className={`table-head-sort ${sortBy === "titleAZ" ? "active" : ""}`}
                    onClick={() => handleSortHeader("title")}
                    aria-label="Sort by project title"
                  >
                    <span>Project</span>
                    <span className="table-head-sort-icon">↕</span>
                  </button>
                </th>

                <th scope="col">Client</th>

                <th scope="col" aria-sort={getAriaSort("amount")}>
                  <button
                    type="button"
                    className={`table-head-sort ${
                      sortBy === "amountHigh" || sortBy === "amountLow" ? "active" : ""
                    }`}
                    onClick={() => handleSortHeader("amount")}
                    aria-label="Sort by amount"
                  >
                    <span>Amount</span>
                    <span className="table-head-sort-icon">
                      {sortBy === "amountLow" ? "↑" : "↓"}
                    </span>
                  </button>
                </th>

                <th scope="col" aria-sort={getAriaSort("deadline")}>
                  <button
                    type="button"
                    className={`table-head-sort ${sortBy === "deadlineSoon" ? "active" : ""}`}
                    onClick={() => handleSortHeader("deadline")}
                    aria-label="Sort by deadline"
                  >
                    <span>Deadline</span>
                    <span className="table-head-sort-icon">↕</span>
                  </button>
                </th>

                <th scope="col">Status</th>
                <th scope="col" className="actions-col">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedBids.length > 0 ? (
                paginatedBids.map((bid) => (
                  <tr key={bid.id}>
                    <td>
                      <div className="bid-project-cell">
                        <span className="bid-project-title">{bid.title}</span>
                        <span className="bid-project-id">Bid #{bid.id}</span>
                      </div>
                    </td>

                    <td>{bid.client}</td>

                    <td className="bid-amount">{formatCurrency(bid.amount)}</td>

                    <td>
                      <div className="bid-deadline-cell">
                        <span>{formatDate(bid.deadline)}</span>
                        <small>{getDaysLeft(bid.deadline)}</small>
                      </div>
                    </td>

                    <td>
                      <span className={getStatusClass(bid.status)}>{bid.status}</span>
                    </td>

                    <td className="bid-action-cell">
                      <div className="row-action-wrap" ref={openMenuId === bid.id ? menuRef : null}>
                        <button
                          type="button"
                          className="row-action-btn"
                          onClick={() =>
                            setOpenMenuId(openMenuId === bid.id ? null : bid.id)
                          }
                          aria-label={`More actions for ${bid.title}`}
                          aria-expanded={openMenuId === bid.id}
                        >
                          ⋯
                        </button>

                        {openMenuId === bid.id && (
                          <div className="row-action-menu">
                            <button type="button">View Details</button>
                            <button type="button">Edit Bid</button>
                            <button type="button" className="danger">
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">
                    <div className="bid-empty-state">
                      <h4>No bids found</h4>
                      <p>Try changing your search, status, or sorting options.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {paginatedBids.length > 0 && (
          <>
            <div className="mobile-bid-cards">
              {paginatedBids.map((bid) => (
                <article className="mobile-bid-card" key={`mobile-${bid.id}`}>
                  <div className="mobile-bid-card-top">
                    <div>
                      <h4>{bid.title}</h4>
                      <p>{bid.client}</p>
                    </div>
                    <span className={getStatusClass(bid.status)}>{bid.status}</span>
                  </div>

                  <div className="mobile-bid-grid">
                    <div>
                      <span className="mobile-label">Amount</span>
                      <strong>{formatCurrency(bid.amount)}</strong>
                    </div>
                    <div>
                      <span className="mobile-label">Deadline</span>
                      <strong>{formatDate(bid.deadline)}</strong>
                      <small>{getDaysLeft(bid.deadline)}</small>
                    </div>
                    <div>
                      <span className="mobile-label">Bid ID</span>
                      <strong>#{bid.id}</strong>
                    </div>
                  </div>

                  <div className="mobile-card-actions">
                    <button type="button">View</button>
                    <button type="button">Edit</button>
                    <button type="button" className="danger">Delete</button>
                  </div>
                </article>
              ))}
            </div>

            <nav className="bid-pagination" aria-label="Table pagination">
              <button
                type="button"
                className="page-btn"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={safePage === 1}
              >
                Previous
              </button>

              <div className="page-indicator">
                Page <strong>{safePage}</strong> of <strong>{totalPages}</strong>
              </div>

              <button
                type="button"
                className="page-btn"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={safePage === totalPages}
              >
                Next
              </button>
            </nav>
          </>
        )}
      </section>
    </div>
  );
}

export default BidTable;