import { Link } from 'react-router-dom';

export default function Footer({ variant = 'full' }) {
  const links = [
    { label: 'Sustainability', href: '#' },
    { label: 'Technical Specs', href: '#' },
    { label: 'Global Shipping', href: '#' },
    { label: 'Press Kit', href: '#' },
  ];

  if (variant === 'minimal') {
    return (
      <footer className="w-full bg-zinc-950 pt-16 pb-8 relative overflow-hidden mt-auto">
        <div className="flex flex-col items-center justify-center w-full px-12 max-w-[1920px] mx-auto z-10 relative">
          <p className="font-light text-zinc-500 text-sm mb-4 text-center">
            Need help? Contact support at 1800-SIDDHAM
          </p>
          <p className="font-light text-zinc-500 text-sm">
            © 2024 Siddham Coolers. Precision in every breath.
          </p>
        </div>
        <div className="text-[8rem] md:text-[12rem] font-black text-zinc-900/30 absolute -bottom-8 md:-bottom-12 left-1/2 -translate-x-1/2 leading-none select-none pointer-events-none whitespace-nowrap">
          Siddham
        </div>
      </footer>
    );
  }

  return (
    <footer className="relative overflow-hidden w-full pt-32 pb-12 bg-zinc-950">
      <div className="flex flex-col md:flex-row justify-between items-end w-full px-12 max-w-[1920px] mx-auto z-10 relative gap-12">
        {/* Links */}
        <div className="flex flex-col gap-4 mb-16 md:mb-0">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="font-light text-zinc-500 hover:text-zinc-300 transition-colors hover:translate-x-1 duration-300 inline-block"
            >
              {link.label}
            </Link>
          ))}
        </div>
        {/* Copyright */}
        <div className="text-right">
          <p className="font-light text-zinc-500 text-sm">
            © 2024 Siddham Coolers. Precision in every breath.
          </p>
        </div>
      </div>
      {/* Giant Brand Watermark */}
      <div className="text-[12rem] font-black text-zinc-900/30 absolute -bottom-10 left-0 leading-none select-none pointer-events-none">
        Siddham
      </div>
    </footer>
  );
}
