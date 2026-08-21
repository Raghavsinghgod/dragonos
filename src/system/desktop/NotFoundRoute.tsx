import { Link } from 'react-router';

export default function NotFoundRoute() {
  return (
    <div className="min-h-screen bg-[#050508] text-white flex flex-col items-center justify-center gap-5 px-6 font-inter">
      <p className="font-display text-7xl md:text-8xl tracking-[0.2em] text-[#dc2626] drop-shadow-[0_0_24px_rgba(220,38,38,0.35)]">
        404
      </p>
      <p className="text-white/60 text-sm md:text-base">
        This corner of the lair doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-2 px-5 py-2.5 rounded-lg border border-[#dc2626]/40 text-[#dc2626] text-sm tracking-wide hover:bg-[#dc2626]/10 hover:border-[#dc2626]/70 transition-colors"
      >
        Return to desktop
      </Link>
    </div>
  );
}
