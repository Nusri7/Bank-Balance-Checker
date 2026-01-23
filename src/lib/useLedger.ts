'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from './supabaseClient';
import { EMPTY_LEDGER } from './ledger';
import type { Deposit, Expense, LedgerData } from './ledger';

const fetchDeposits = async () => {
  const { data, error } = await supabase
    .from('deposits')
    .select('id, amount, date')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Deposit[];
};

const fetchExpenses = async () => {
  const { data, error } = await supabase
    .from('expenses')
    .select('id, description, amount, date')
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as Expense[];
};

export const useLedger = () => {
  const [ledger, setLedger] = useState<LedgerData>(EMPTY_LEDGER);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        setLoading(true);
        const [deposits, expenses] = await Promise.all([fetchDeposits(), fetchExpenses()]);
        if (!cancelled) {
          setLedger({ deposits, expenses });
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load ledger data.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

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

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const { data, error } = await supabase
      .from('expenses')
      .insert({
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
      })
      .select('id, description, amount, date')
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    if (data) {
      setLedger((prev) => ({
        ...prev,
        expenses: [data as Expense, ...prev.expenses],
      }));
    }
  };

  const deleteExpense = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id);

    if (error) {
      setError(error.message);
      return;
    }

    setLedger((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((expense) => expense.id !== id),
    }));
  };

  const addDeposit = async (deposit: Omit<Deposit, 'id'>) => {
    const { data, error } = await supabase
      .from('deposits')
      .insert({
        amount: deposit.amount,
        date: deposit.date,
      })
      .select('id, amount, date')
      .single();

    if (error) {
      setError(error.message);
      return;
    }

    if (data) {
      setLedger((prev) => ({
        ...prev,
        deposits: [data as Deposit, ...prev.deposits],
      }));
    }
  };

  const deleteDeposit = async (id: string) => {
    const { error } = await supabase.from('deposits').delete().eq('id', id);

    if (error) {
      setError(error.message);
      return;
    }

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
    loading,
    error,
  };
};
