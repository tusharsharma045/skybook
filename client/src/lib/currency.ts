export const formatRupees = (amount: number | string | undefined | null): string => {
  if (amount === undefined || amount === null) return '₹0';
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '₹0';

  return `₹${num.toLocaleString('en-IN')}`;
};

export const DEFAULT_ORIGIN = {
  iataCode: 'DEL',
  name: 'Indira Gandhi International Airport',
  city: 'New Delhi',
  country: 'India',
};

export const DEFAULT_DESTINATION = {
  iataCode: 'BOM',
  name: 'Chhatrapati Shivaji Maharaj International Airport',
  city: 'Mumbai',
  country: 'India',
};
