export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
};

export type Deposit = {
  id: string;
  amount: number;
  date: string;
};

export type LedgerData = {
  deposits: Deposit[];
  expenses: Expense[];
};

export const STORAGE_KEY = 'personal-ledger-v1';

export const DEFAULT_LEDGER: LedgerData = {
  deposits: [{ id: 'dep-1', amount: 50000, date: '2026-01-04' }],
  expenses: [
    { id: 'exp-10', description: 'Wellampitiya Home Water', amount: 500, date: '2026-01-12' },
    { id: 'exp-9', description: 'Rent Home Water', amount: 1040, date: '2026-01-11' },
    { id: 'exp-8', description: 'Rent Home Electricity', amount: 1060, date: '2026-01-11' },
    { id: 'exp-7', description: "People's Bank Transfer", amount: 10000, date: '2026-01-10' },
    { id: 'exp-6', description: 'Kolonnawa Withdrawal', amount: 2500, date: '2026-01-09' },
    { id: 'exp-5', description: 'Auto Petrol', amount: 700, date: '2026-01-09' },
    { id: 'exp-4', description: 'Kolonnawa Withdrawal', amount: 10000, date: '2026-01-08' },
    { id: 'exp-3', description: 'Azwer Mama Beef Money', amount: 2500, date: '2026-01-07' },
    { id: 'exp-2', description: 'Rani Mami Water Bill', amount: 2500, date: '2026-01-06' },
    { id: 'exp-1', description: 'Rani Mami Electricity', amount: 2500, date: '2026-01-05' }
  ],
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const parseAmount = (value: unknown, fallback: number) => {
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) && num >= 0 ? num : fallback;
};

const sanitizeDeposit = (value: unknown): Deposit | null => {
  if (!isRecord(value)) return null;

  const id = typeof value.id === 'string' && value.id.trim() ? value.id : null;
  const date = typeof value.date === 'string' && value.date.trim() ? value.date.trim() : null;

  if (!id || !date) return null;

  return {
    id,
    date,
    amount: parseAmount(value.amount, 0),
  };
};

const sanitizeExpense = (value: unknown): Expense | null => {
  if (!isRecord(value)) return null;

  const id = typeof value.id === 'string' && value.id.trim() ? value.id : null;
  const description =
    typeof value.description === 'string' && value.description.trim()
      ? value.description.trim()
      : null;
  const date = typeof value.date === 'string' && value.date.trim() ? value.date.trim() : null;

  if (!id || !description || !date) return null;

  return {
    id,
    description,
    date,
    amount: parseAmount(value.amount, 0),
  };
};

export const sanitizeLedger = (value: unknown): LedgerData => {
  if (!isRecord(value)) return DEFAULT_LEDGER;

  const depositsRaw = Array.isArray(value.deposits) ? value.deposits : [];
  const deposits = depositsRaw.map(sanitizeDeposit).filter(Boolean) as Deposit[];

  const expensesRaw = Array.isArray(value.expenses) ? value.expenses : [];
  const expenses = expensesRaw.map(sanitizeExpense).filter(Boolean) as Expense[];

  if (!('deposits' in value) && 'openingBalance' in value) {
    const openingBalance = parseAmount(value.openingBalance, 0);
    const fallbackDate =
      typeof window !== 'undefined' ? new Date().toISOString().slice(0, 10) : '2026-01-01';

    return {
      deposits: [{ id: 'dep-legacy', amount: openingBalance, date: fallbackDate }],
      expenses,
    };
  }

  return {
    deposits,
    expenses,
  };
};
