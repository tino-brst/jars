-- Adds a check to make sure the lasFourDigits field on a card is exactly 4 digits 

ALTER TABLE "Card"
ADD CONSTRAINT last_four_digits_length CHECK (
  LENGTH("lastFourDigits") = 4
);