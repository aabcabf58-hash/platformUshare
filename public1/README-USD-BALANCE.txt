USD BALANCE UPDATE

The Users Management page now includes:
- Add LBP
- Subtract LBP
- Add USD
- Subtract USD

All four operations use:
POST /auth/addBalance

LBP request body:
{
  numberphone,
  amount,
  direction,
  currency: "LBP",
  text
}

USD request body:
{
  numberphone,
  amount,
  direction,
  currency: "USD",
  text
}

The optional text field continues to send null when left empty.
