const recentOrders = [
  { id: '#88294', date: 'Today, 14:20', amount: '₹14,500', commission: '+₹1,450', icon: 'ac_unit' },
  { id: '#88210', date: 'Yesterday, 09:15', amount: '₹22,000', commission: '+₹2,200', icon: 'inventory_2' },
  { id: '#88042', date: 'Oct 12, 16:45', amount: '₹8,500', commission: '+₹850', icon: 'inventory_2' },
];

export default function RetailerPortal() {
  return (
    <main className="flex-grow pt-32 pb-24 px-6 md:px-12 max-w-[1920px] mx-auto w-full">
      {/* Header */}
      <header className="mb-16 mt-8">
        <h1 className="font-headline font-semibold text-[2.0rem] text-on-background tracking-tight">Partner Dashboard</h1>
        <p className="font-body font-light text-[0.875rem] text-on-surface-variant mt-3 max-w-2xl leading-relaxed">
          Monitor your referral performance, manage your exclusive partner codes, and track your upcoming commissions with precision.
        </p>
      </header>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ─── Hero Earnings (Span 8) ─── */}
        <div className="col-span-1 lg:col-span-8 bg-surface-container-lowest rounded-xl p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-32 -bottom-32 w-[30rem] h-[30rem] bg-surface-container rounded-full blur-[80px] pointer-events-none opacity-50" />
          <div className="relative z-10">
            <span className="font-bold text-[0.6875rem] uppercase tracking-widest text-on-surface-variant">Total Revenue Generated</span>
            <div className="mt-6 flex flex-col md:flex-row md:items-baseline gap-4 md:gap-8">
              <h2 className="font-headline font-bold text-[3.5rem] leading-none text-on-background tracking-tighter">₹4,28,500</h2>
              <div className="inline-flex items-center gap-2 bg-primary-fixed px-3 py-1.5 rounded-full self-start md:self-auto">
                <span className="material-symbols-outlined text-[1rem] text-on-primary-fixed-variant">trending_up</span>
                <span className="font-body font-medium text-[0.75rem] text-on-primary-fixed-variant">+12.4% this month</span>
              </div>
            </div>
          </div>
          <div className="relative z-10 flex flex-wrap gap-x-16 gap-y-10 mt-16 md:mt-24 pt-8">
            <div>
              <span className="font-body font-light text-[0.875rem] text-on-surface-variant">Your Commission Earned</span>
              <div className="font-body font-medium text-[1.5rem] text-primary mt-2">₹42,850</div>
            </div>
            <div>
              <span className="font-body font-light text-[0.875rem] text-on-surface-variant">Pending Payout</span>
              <div className="font-body font-medium text-[1.125rem] text-on-surface mt-2">₹8,400</div>
            </div>
            <div>
              <span className="font-body font-light text-[0.875rem] text-on-surface-variant">Orders Linked</span>
              <div className="font-body font-medium text-[1.125rem] text-on-surface mt-2">142</div>
            </div>
          </div>
        </div>

        {/* ─── Coupon (Span 4) ─── */}
        <div className="col-span-1 lg:col-span-4 bg-surface-container rounded-xl p-8 md:p-10 flex flex-col relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-fixed-dim/30 rounded-full blur-3xl pointer-events-none" />
          <span className="font-bold text-[0.6875rem] uppercase tracking-widest text-on-surface-variant relative z-10">Your Unique Link</span>
          <div className="mt-8 w-full bg-surface-container-lowest rounded-xl p-6 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative z-10">
            <span className="font-body font-light text-[0.75rem] text-on-surface-variant mb-2">Discount Code (10% Off)</span>
            <div className="flex items-center justify-between">
              <span className="font-headline font-bold text-[1.25rem] tracking-widest text-primary">SIDDHAM-AIR-10</span>
              <button className="w-10 h-10 rounded-full bg-surface hover:bg-surface-variant flex items-center justify-center transition-colors">
                <span className="material-symbols-outlined text-[1.1rem] text-on-surface-variant">content_copy</span>
              </button>
            </div>
          </div>
          <div className="mt-auto pt-10 relative z-10">
            <button className="w-full btn-gradient text-on-primary rounded-xl px-6 py-4 font-body font-medium text-[0.875rem] flex items-center justify-center gap-3 hover:opacity-90 transition-opacity duration-300">
              <span className="material-symbols-outlined text-[1.2rem]">share</span>
              Share Code
            </button>
          </div>
        </div>

        {/* ─── Sales Log (Span 7) ─── */}
        <div className="col-span-1 lg:col-span-7 bg-surface-container-lowest rounded-xl p-8 md:p-10 flex flex-col">
          <span className="font-bold text-[0.6875rem] uppercase tracking-widest text-on-surface-variant mb-8 block">Recent Attributed Orders</span>
          <div className="flex flex-col gap-4">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex justify-between items-center bg-surface hover:bg-surface-container-low transition-colors duration-300 rounded-lg p-5 cursor-default group"
                style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)' }}
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center group-hover:bg-surface-container-highest transition-colors">
                    <span className="material-symbols-outlined text-on-surface text-[1.2rem]">{order.icon}</span>
                  </div>
                  <div>
                    <div className="font-body font-medium text-[1rem] text-on-surface">Order {order.id}</div>
                    <div className="font-body font-light text-[0.875rem] text-on-surface-variant mt-0.5">{order.date}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-body font-medium text-[1rem] text-on-surface">{order.amount}</div>
                  <div className="font-body font-light text-[0.875rem] text-primary flex items-center justify-end gap-1 mt-0.5">
                    {order.commission}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-4">
            <button className="text-primary font-body font-medium text-[0.875rem] hover:opacity-70 transition-opacity flex items-center gap-2">
              View All Transactions
              <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* ─── Payout Config (Span 5) ─── */}
        <div className="col-span-1 lg:col-span-5 bg-surface-container-lowest rounded-xl p-8 md:p-10 flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <span className="font-bold text-[0.6875rem] uppercase tracking-widest text-on-surface-variant block">Payout Configuration</span>
            <button className="w-10 h-10 rounded-full bg-surface hover:bg-surface-variant flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[1.1rem] text-on-surface-variant">edit</span>
            </button>
          </div>
          <div className="flex flex-col gap-6 flex-grow">
            <div>
              <label className="font-body font-light text-[0.75rem] text-on-surface-variant mb-2 block">Primary Bank Account</label>
              <div className="w-full bg-surface-container rounded-xl px-5 py-4 border border-outline-variant/15 flex items-center gap-4">
                <span className="material-symbols-outlined text-on-surface-variant text-[1.4rem]">account_balance</span>
                <div>
                  <div className="font-body font-medium text-[0.875rem] text-on-surface">HDFC Bank</div>
                  <div className="font-body font-light text-[0.75rem] text-on-surface-variant tracking-widest mt-0.5">•••• •••• 4492</div>
                </div>
              </div>
            </div>
            <div>
              <label className="font-body font-light text-[0.75rem] text-on-surface-variant mb-2 block">UPI ID</label>
              <div className="w-full bg-surface-container rounded-xl px-5 py-4 border border-outline-variant/15 flex items-center gap-4">
                <span className="material-symbols-outlined text-on-surface-variant text-[1.4rem]">qr_code</span>
                <div className="font-body font-medium text-[0.875rem] text-on-surface">partner.siddham@upi</div>
              </div>
            </div>
            <div className="mt-auto pt-8">
              <div className="inline-flex items-center gap-3 bg-surface-container-low px-5 py-3 rounded-xl w-full border border-outline-variant/15">
                <div className="w-2.5 h-2.5 rounded-full bg-primary relative">
                  <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20" />
                </div>
                <div>
                  <span className="font-body font-medium text-[0.875rem] text-on-surface block">Auto-Payouts Active</span>
                  <span className="font-body font-light text-[0.75rem] text-on-surface-variant">Next transfer on 1st of month</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
