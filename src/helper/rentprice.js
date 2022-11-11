const RENT_PRICE = 100;

const rentPrice = (user_return_date, renturn_date) => {
  const userReturnDate = new Date(user_return_date);
  const returnDate = new Date(renturn_date);

  const dateDiference = userReturnDate.getTime() - returnDate.getTime();
  const daysDiference = dateDiference / (1000 * 60 * 60 * 24);

  if (daysDiference < 0) return RENT_PRICE;

  let penaltyPrice = RENT_PRICE;

  for (let i = 0; i < daysDiference; i++) {
    penaltyPrice += penaltyPrice * 0.1;
  }

  return penaltyPrice;
};

module.exports = { rentPrice };
