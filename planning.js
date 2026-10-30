const valid = n => Number.isSafeInteger(n) && n >= 0;
export function affordability(income, expenses, buffer, planned) {
  if (![income, expenses, buffer, planned].every(valid)) throw new RangeError('Use non-negative amounts.');
  const surplus = Math.max(0, income - expenses - buffer);
  return {surplus, shortfall: Math.max(0, expenses + buffer - income), contribution: Math.min(planned, surplus), status: surplus === 0 ? 'pause' : surplus < planned ? 'reduce' : 'on-track'};
}
export function withdrawalOptions(goals, amount, selected) {
  if (!Number.isSafeInteger(amount) || amount <= 0 || !goals[selected]) throw new RangeError('Choose a goal and positive withdrawal.');
  if (goals.some(g => !valid(g.balance) || !valid(g.minimum))) throw new RangeError('Invalid goal balance.');
  const single = goals[selected].balance >= amount ? [{index:selected, amount}] : null;
  let remaining = amount;
  const split = [];
  const ordered = [selected, ...goals.map((_, i) => i).filter(i => i !== selected)];
  for (const index of ordered) {
    const take = Math.min(remaining, Math.max(0, goals[index].balance - goals[index].minimum));
    if (take) split.push({index,amount:take});
    remaining -= take;
  }
  return {single, crossesMinimum: !!single && goals[selected].balance - amount < goals[selected].minimum, split: remaining === 0 ? split : null, availableAboveMinimum: goals.reduce((s,g)=>s+Math.max(0,g.balance-g.minimum),0)};
}
export function planContributions(plans, surplus) {
  if (!valid(surplus)) throw new RangeError('Invalid available amount.');
  return plans.map(plan => {
    if (![plan.outstanding,plan.contribution].every(valid)) throw new RangeError('Invalid plan.');
    const amount = Math.min(plan.outstanding,plan.contribution,surplus);
    surplus -= amount;
    return {amount, periods:amount ? Math.ceil(plan.outstanding/amount) : null};
  });
}
