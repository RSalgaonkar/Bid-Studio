export const selectBids = (state) => state.bids.list;
export const selectBidFilters = (state) => state.bids.filters;
export const selectSelectedBidId = (state) => state.bids.selectedBidId;

export const selectFilteredBids = (state) => {
  const bids = selectBids(state);
  const filters = selectBidFilters(state);

  return bids.filter((bid) => {
    const matchesSearch = bid.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    const matchesStatus =
      filters.status === "all" || bid.status === filters.status;

    const matchesPriority =
      filters.priority === "all" || bid.priority === filters.priority;

    const matchesClient =
      filters.clientId === "all" || String(bid.clientId) === String(filters.clientId);

    return matchesSearch && matchesStatus && matchesPriority && matchesClient;
  });
};

export const selectSelectedBid = (state) => {
  const bids = selectBids(state);
  const selectedBidId = selectSelectedBidId(state);

  return bids.find((bid) => bid.id === selectedBidId) || null;
};