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

export const EMPTY_LEDGER: LedgerData = {
  deposits: [],
  expenses: [],
};
