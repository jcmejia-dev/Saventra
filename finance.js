export function recovery(balance, withdrawal, contribution) {
  if (![balance, withdrawal, contribution].every(Number.isSafeInteger) || balance < 0 || withdrawal <= 0 || withdrawal > balance || contribution <= 0) throw new RangeError('Enter positive amounts within the available balance.');
  const count = Math.ceil(withdrawal / contribution);
  return { remaining: balance - withdrawal, count, last: withdrawal - contribution * (count - 1) };
}
