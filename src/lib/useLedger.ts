'use client';

import { useEffect, useMemo, useState } from 'react';
import { DEFAULT_LEDGER, STORAGE_KEY, sanitizeLedger } from './ledger';
import type { Deposit, Expense, LedgerData } from './ledger';

const readLedger = (): LedgerData => {
  if (typeof window === 'undefined') return DEFAULT_LEDGER;

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_LEDGER;

    return sanitizeLedger(JSON.parse(stored));
  } catch {
    return DEFAULT_LEDGER;
  }
};

const writeLedger = (value: LedgerData) => {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Ignore write errors (private mode, quota, etc.)
  }
};

const createId = (prefix: string) => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export const useLedger = () => {
  const [ledger, setLedger] = useState<LedgerData>(DEFAULT_LEDGER);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setLedger(readLedger());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    writeLedger(ledger);
  }, [hydrated, ledger]);

  const totalSpent = useMemo(
    () => ledger.expenses.reduce((sum, expense) => sum + expense.amount, 0),
    [ledger.expenses]
  );

  const totalDeposited = useMemo(
    () => ledger.deposits.reduce((sum, deposit) => sum + deposit.amount, 0),
    [ledger.deposits]
  );

  const currentBalance = useMemo(
    () => totalDeposited - totalSpent,
    [totalDeposited, totalSpent]
  );

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setLedger((prev) => ({
      ...prev,
      expenses: [{ ...expense, id: createId('exp') }, ...prev.expenses],
    }));
  };

  const deleteExpense = (id: string) => {
    setLedger((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((expense) => expense.id !== id),
    }));
  };

  const addDeposit = (deposit: Omit<Deposit, 'id'>) => {
    setLedger((prev) => ({
      ...prev,
      deposits: [{ ...deposit, id: createId('dep') }, ...prev.deposits],
    }));
  };

  const deleteDeposit = (id: string) => {
    setLedger((prev) => ({
      ...prev,
      deposits: prev.deposits.filter((deposit) => deposit.id !== id),
    }));
  };

  const orderedExpenses = useMemo(
    () =>
      [...ledger.expenses].sort((a, b) => {
        if (a.date === b.date) return 0;
        return a.date > b.date ? -1 : 1;
      }),
    [ledger.expenses]
  );

  const orderedDeposits = useMemo(
    () =>
      [...ledger.deposits].sort((a, b) => {
        if (a.date === b.date) return 0;
        return a.date > b.date ? -1 : 1;
      }),
    [ledger.deposits]
  );

  const latestDeposit = orderedDeposits[0] ?? null;

  return {
    ledger,
    setLedger,
    addExpense,
    deleteExpense,
    addDeposit,
    deleteDeposit,
    orderedExpenses,
    orderedDeposits,
    totalSpent,
    totalDeposited,
    currentBalance,
    latestDeposit,
    hydrated,
  };
};
