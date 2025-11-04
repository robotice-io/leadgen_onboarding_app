export default function PayCancelPage() {
  return (
    <main className="min-h-[70vh] grid place-items-center bg-black text-white">
      <div className="text-center max-w-xl mx-auto px-6">
        <div className="mx-auto mb-6 h-14 w-14 rounded-full grid place-items-center bg-red-600/20 text-red-400">
          <span className="inline-block h-6 w-6">✖</span>
        </div>
        <h1 className="text-3xl font-semibold">Payment canceled</h1>
        <p className="text-white/70 mt-2">You can try again at any time.</p>
        <div className="mt-6">
          <a href="/pay" className="inline-flex items-center justify-center px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-500 font-semibold text-white">Try again</a>
        </div>
      </div>
    </main>
  );
}
