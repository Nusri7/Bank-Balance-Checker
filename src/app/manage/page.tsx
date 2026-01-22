'use client';

import Link from 'next/link';
import { type ChangeEvent, type FormEvent, useEffect, useState } from 'react';
import { formatCurrency, formatDate } from '@/lib/format';
import { useLedger } from '@/lib/useLedger';

const emptyExpenseState = {
  description: '',
  amount: '',
  date: '',
};

const emptyDepositState = {
  amount: '',
  date: '',
};

export default function ManagePage() {
  const {
    addExpense,
    deleteExpense,
    addDeposit,
    deleteDeposit,
    orderedExpenses,
    orderedDeposits,
    totalSpent,
    totalDeposited,
    currentBalance,
  } = useLedger();

  const [expenseForm, setExpenseForm] = useState(emptyExpenseState);
  const [depositForm, setDepositForm] = useState(emptyDepositState);
  const [expenseError, setExpenseError] = useState('');
  const [depositError, setDepositError] = useState('');

  useEffect(() => {
    if (!expenseForm.date) {
      setExpenseForm((prev) => ({
        ...prev,
        date: new Date().toISOString().slice(0, 10),
      }));
    }
  }, [expenseForm.date]);

  useEffect(() => {
    if (!depositForm.date) {
      setDepositForm((prev) => ({
        ...prev,
        date: new Date().toISOString().slice(0, 10),
      }));
    }
  }, [depositForm.date]);

  const handleExpenseChange = (field: keyof typeof expenseForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setExpenseForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleDepositChange = (field: keyof typeof depositForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setDepositForm((prev) => ({
        ...prev,
        [field]: event.target.value,
      }));
    };

  const handleAddExpense = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setExpenseError('');

    const description = expenseForm.description.trim();
    const amountValue = Number(expenseForm.amount);

    if (!description) {
      setExpenseError('Please add a short description.');
      return;
    }

    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      setExpenseError('Enter a valid amount greater than zero.');
      return;
    }

    if (!expenseForm.date) {
      setExpenseError('Please select a date.');
      return;
    }

    addExpense({
      description,
      amount: amountValue,
      date: expenseForm.date,
    });

    setExpenseForm((prev) => ({
      ...prev,
      description: '',
      amount: '',
    }));
  };

  const handleAddDeposit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDepositError('');

    const amountValue = Number(depositForm.amount);

    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      setDepositError('Enter a valid amount greater than zero.');
      return;
    }

    if (!depositForm.date) {
      setDepositError('Please select a date.');
      return;
    }

    addDeposit({
      amount: amountValue,
      date: depositForm.date,
    });

    setDepositForm((prev) => ({
      ...prev,
      amount: '',
    }));
  };

  return (
    <main className="flex flex-1 flex-col gap-8">
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <p className="label">Admin / Private</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">Manage Ledger</h1>
          <p className="mt-2 max-w-xl text-sm text-stone-600 sm:text-base">
            Add expenses and deposits, then share the dashboard link for a simple read-only view.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="surface-strong inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-stone-800"
        >
          Open Dad's Dashboard -&gt;
        </Link>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="surface p-6">
          <h2 className="text-xl">Add Expense</h2>
          <form onSubmit={handleAddExpense} className="mt-5 flex flex-col gap-4">
            <label className="text-sm font-semibold text-stone-700">
              Description
              <input
                type="text"
                placeholder="e.g., Electricity Bill"
                value={expenseForm.description}
                onChange={handleExpenseChange('description')}
                className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-base shadow-sm focus:border-stone-400 focus:outline-none"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-stone-700">
                Amount
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  step="1"
                  placeholder="0"
                  value={expenseForm.amount}
                  onChange={handleExpenseChange('amount')}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-base shadow-sm focus:border-stone-400 focus:outline-none"
                />
              </label>
              <label className="text-sm font-semibold text-stone-700">
                Date
                <input
                  type="date"
                  value={expenseForm.date}
                  onChange={handleExpenseChange('date')}
                  className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-base shadow-sm focus:border-stone-400 focus:outline-none"
                />
              </label>
            </div>
            {expenseError ? <p className="text-sm font-semibold text-expense">{expenseError}</p> : null}
            <button
              type="submit"
              className="rounded-xl bg-ink px-5 py-3 text-base font-semibold text-white transition hover:opacity-90"
            >
              Save Expense
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-4">
          <div className="surface p-6">
            <h2 className="text-xl">Record Deposit</h2>
            <form onSubmit={handleAddDeposit} className="mt-5 flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold text-stone-700">
                  Amount
                  <input
                    type="number"
                    inputMode="numeric"
                    min="0"
                    step="1"
                    placeholder="0"
                    value={depositForm.amount}
                    onChange={handleDepositChange('amount')}
                    className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-base shadow-sm focus:border-stone-400 focus:outline-none"
                  />
                </label>
                <label className="text-sm font-semibold text-stone-700">
                  Date
                  <input
                    type="date"
                    value={depositForm.date}
                    onChange={handleDepositChange('date')}
                    className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-base shadow-sm focus:border-stone-400 focus:outline-none"
                  />
                </label>
              </div>
              {depositError ? <p className="text-sm font-semibold text-expense">{depositError}</p> : null}
              <button
                type="submit"
                className="rounded-xl bg-ink px-5 py-3 text-base font-semibold text-white transition hover:opacity-90"
              >
                Save Deposit
              </button>
            </form>
          </div>

          <div className="surface p-6">
            <p className="label">Totals</p>
            <div className="mt-4 grid gap-4">
              <div>
                <p className="text-sm text-stone-500">Current Balance</p>
                <p className="text-3xl font-semibold text-balance">{formatCurrency(currentBalance)}</p>
              </div>
              <div>
                <p className="text-sm text-stone-500">Total Deposited</p>
                <p className="text-2xl font-semibold text-balance">{formatCurrency(totalDeposited)}</p>
              </div>
              <div>
                <p className="text-sm text-stone-500">Total Spent</p>
                <p className="text-2xl font-semibold text-expense">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="label">Deposits</p>
            <h2 className="mt-2 text-xl">All Deposits</h2>
          </div>
          <p className="text-sm text-stone-500">Most recent first</p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {orderedDeposits.length === 0 ? (
            <p className="text-sm text-stone-500">No deposits yet.</p>
          ) : (
            orderedDeposits.map((deposit) => (
              <div
                key={deposit.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-base font-semibold text-stone-800">{formatCurrency(deposit.amount)}</p>
                  <p className="text-xs text-stone-500">{formatDate(deposit.date)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => deleteDeposit(deposit.id)}
                  className="rounded-full border border-stone-200 px-3 py-1 text-xs font-semibold text-stone-600 transition hover:border-stone-400"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="surface p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="label">Ledger Entries</p>
            <h2 className="mt-2 text-xl">All Expenses</h2>
          </div>
          <p className="text-sm text-stone-500">Most recent first</p>
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {orderedExpenses.length === 0 ? (
            <p className="text-sm text-stone-500">No expenses yet.</p>
          ) : (
            orderedExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-stone-200 bg-white px-4 py-3"
              >
                <div>
                  <p className="text-base font-semibold text-stone-800">{expense.description}</p>
                  <p className="text-xs text-stone-500">{formatDate(expense.date)}</p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-base font-semibold text-expense">
                    -{formatCurrency(expense.amount)}
                  </p>
                  <button
                    type="button"
                    onClick={() => deleteExpense(expense.id)}
                    className="rounded-full border border-stone-200 px-3 py-1 text-xs font-semibold text-stone-600 transition hover:border-stone-400"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
