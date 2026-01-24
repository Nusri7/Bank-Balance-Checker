import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="label">Personal Ledger</p>
        <h1 className="text-4xl sm:text-5xl">Family Balance Tracker</h1>
        <p className="max-w-2xl text-base text-stone-700 sm:text-lg">
          Keep your father&apos;s expenses clear and easy to follow. Use the manage view to add deposits and
          expenses, and share the dashboard link for a clean, read-only balance view.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/manage"
          className="surface group flex flex-col justify-between gap-6 p-6 transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div>
            <p className="label">Private</p>
            <h2 className="mt-3 text-2xl">Manage Expenses</h2>
            <p className="mt-3 text-stone-600">
              Add deposits, track expenses, and correct entries.
            </p>
          </div>
          <div className="text-sm font-semibold text-stone-800">Open Admin -&gt;</div>
        </Link>

        <Link
          href="/dashboard"
          className="surface group flex flex-col justify-between gap-6 p-6 transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div>
            <p className="label">Read Only</p>
            <h2 className="mt-3 text-2xl">Dad&apos;s Dashboard</h2>
            <p className="mt-3 text-stone-600">
              Large balance display with a simple list of expenses for quick review.
            </p>
          </div>
          <div className="text-sm font-semibold text-stone-800">View Dashboard -&gt;</div>
        </Link>

        <Link
          href="/my-ledger"
          className="surface group flex flex-col justify-between gap-6 p-6 transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div>
            <p className="label">Private</p>
            <h2 className="mt-3 text-2xl">My Money</h2>
            <p className="mt-3 text-stone-600">
              Track your own deposits and expenses with a separate balance view.
            </p>
          </div>
          <div className="text-sm font-semibold text-stone-800">Open My Ledger -&gt;</div>
        </Link>
      </section>
    </main>
  );
}
