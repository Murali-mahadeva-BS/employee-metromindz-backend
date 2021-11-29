const pagination = (page, perPage) => {
  let fromItems = 0;
  let toItems = 0;
  if (!perPage || perPage == 0) perPage = 5;
  else {
    perPage = parseInt(perPage);
  }
  if (!page) page = 0;
  else {
    page = parseInt(page);
    if (page === 1) fromItems = perPage;
    if (page > 1) fromItems = page * perPage;
  }
  toItems = fromItems + perPage;
  return fromItems, toItems;
};
const sorting = (sort) => {
  let sortItem = null,
    sortOrder = null;
  if (sort) {
    let split = sort.split(",");
    sortItem = split[0] ? split[0] : null;
    sortOrder = split[1] ? split[1] : null;
  }
  return sortItem, sortOrder;
};
module.exports = { pagination, sorting };
