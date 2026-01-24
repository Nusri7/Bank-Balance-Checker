'use client';

import { formatCurrency, formatDate } from '@/lib/format';
import { useLedger } from '@/lib/useLedger';

export default function DashboardPage() {
  const {
    orderedExpenses,
    totalSpent,
    totalDeposited,
    currentBalance,
    latestDeposit,
    loading,
    error,
  } = useLedger('dad');

  return (
    <main className="flex flex-1 flex-col gap-8">
      <header className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="text-3xl sm:text-4xl">Current Balance</h1>
          <p className="mt-2 max-w-xl text-sm text-stone-600 sm:text-base">
            Clear summary of all expenses and the remaining balance.
          </p>
          {loading ? (
            <p className="mt-3 text-sm text-stone-500">Loading data...</p>
          ) : null}
          {error ? <p className="mt-2 text-sm font-semibold text-expense">{error}</p> : null}
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="surface p-6 sm:p-8">
          <p className="label">Balance</p>
          <p className="mt-4 text-4xl font-semibold text-balance sm:text-5xl">
            {formatCurrency(currentBalance)}
          </p>
          <p className="mt-2 text-sm text-stone-500">
            Total Deposited: {formatCurrency(totalDeposited)}
          </p>
        </div>

        <div className="surface p-6 sm:p-8">
          <p className="label">Total Spent</p>
          <p className="mt-4 text-3xl font-semibold text-expense sm:text-4xl">
            {formatCurrency(totalSpent)}
          </p>
          <p className="mt-2 text-sm text-stone-500">Sum of all recorded expenses.</p>
        </div>
      </section>

      <section className="surface p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="label">Latest Deposit</p>
            <h2 className="mt-2 text-xl sm:text-2xl">
              {latestDeposit ? formatCurrency(latestDeposit.amount) : 'No deposits yet'}
            </h2>
          </div>
          {latestDeposit ? (
            <p className="text-sm text-stone-500">{formatDate(latestDeposit.date)}</p>
          ) : null}
        </div>
      </section>

      <section className="surface p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="label">Expenses</p>
            <h2 className="mt-2 text-xl sm:text-2xl">Recent Activity</h2>
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
                <p className="text-base font-semibold text-expense">-{formatCurrency(expense.amount)}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
