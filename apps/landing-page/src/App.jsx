import { useState, useEffect } from 'react';

const WA_NUMBER = '918686779278';
const WA_MESSAGE = encodeURIComponent("Hi! I'd like to book a home service.");
const WA_MESSAGE_PRO = encodeURIComponent("Hi! I'd like to become a partner with your company.");
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;
const WA_URL_PRO = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE_PRO}`;

// Custom palette — only used as Tailwind arbitrary values or minimal inline styles
const C = {
    p50: '#F5F4FE',
    p100: '#EEEDFE',
    p200: '#CECBF6',
    p300: '#AFA9EC',
    p400: '#7F77DD',
    p500: '#534AB7',
    p600: '#3C3489',
    p700: '#26215C',
    t50: '#E1F5EE',
    t200: '#5DCAA5',
    t600: '#0F6E56',
};

const WaIcon = ({ size = 16 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

const SectionLabel = ({ children }) => (
    <p
        className="font-sans text-xs font-medium uppercase tracking-widest mb-3"
        style={{ color: C.p400 }}
    >
        {children}
    </p>
);

const SectionHeading = ({ children }) => (
    <h2
        className="font-serif text-4xl font-light tracking-tight leading-tight"
        style={{ color: C.p700 }}
    >
        {children}
    </h2>
);

export default function App() {
    const [open, setOpen] = useState(null);
    const [visible, setVisible] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 80);
    }, []);

    const fadeIn = (delay = '') =>
        `transition-all duration-700 ${delay} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`;

    const services = [
        { name: 'Cleaning', icon: '✦', live: true },
        { name: 'Plumbing', icon: '◈', live: true },
        { name: 'Electrical', icon: '⬡', live: true },
        { name: 'Painting', icon: '◉', live: false },
        { name: 'Carpentry', icon: '◧', live: false },
        { name: 'Appliance Repair', icon: '⊛', live: false },
    ];

    const steps = [
        {
            num: '01',
            title: 'Choose Service',
            desc: 'Browse our verified professionals and pick the service you need.',
            accent: C.p200,
        },
        {
            num: '02',
            title: 'Book a Schedule',
            desc: 'Pick a date and time that works for you — flexible and easy.',
            accent: C.t200,
        },
        {
            num: '03',
            title: 'Get It Done',
            desc: 'A vetted professional arrives at your door, ready to work.',
            accent: C.p400,
        },
    ];

    const reviews = [
        {
            name: 'Sarah K.',
            role: 'Homeowner',
            text: 'Booking was effortless and the cleaner was absolutely fantastic. Will use again.',
        },
        {
            name: 'John D.',
            role: 'Landlord',
            text: 'The electrician arrived on time and finished ahead of schedule. Outstanding.',
        },
        {
            name: 'Mia R.',
            role: 'Tenant',
            text: 'Super professional plumber. Fixed the issue in under an hour.',
        },
        {
            name: 'Alex T.',
            role: 'Manager',
            text: 'Reliable, fast, and fairly priced. Exactly what I was looking for.',
        },
    ];

    const faqs = [
        {
            q: 'How do I book a service?',
            a: "Simply tap the WhatsApp button and message us — we'll get you booked within minutes.",
        },
        {
            q: 'Are professionals verified?',
            a: 'Yes. Every professional undergoes a thorough background check and skills assessment before joining.',
        },
        {
            q: 'What areas do you cover?',
            a: 'We currently serve the greater Nellore area with plans to expand.',
        },
        {
            q: 'Can I reschedule a booking?',
            a: "Absolutely. Message us at any time and we'll adjust your appointment.",
        },
    ];

    return (
        <div className="font-serif min-h-screen" style={{ background: C.p50, color: '#2C2C2A' }}>
            {/* Fonts + keyframe animations only — nothing layout/color related */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', Georgia, serif !important; }
        .font-sans  { font-family: 'DM Sans', system-ui, sans-serif !important; }
        @keyframes float   { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes shimmer { 0%,100%{opacity:.5} 50%{opacity:1} }
        .float  { animation: float 5s ease-in-out infinite; }
        .float2 { animation: float 6s ease-in-out 1s infinite; }
        .shimmer { animation: shimmer 2s infinite; }
      `}</style>

            {/* ══════════════
          NAV
      ══════════════ */}
            <nav
                className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-16 py-4 backdrop-blur-md border-b"
                style={{ background: 'rgba(245,244,254,0.93)', borderColor: C.p200 }}
            >
                <span
                    className="font-serif text-2xl font-semibold tracking-tight"
                    style={{ color: C.p700 }}
                >
                    Home <span style={{ color: C.p400 }}>Hero</span>
                </span>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-8">
                    {['Services', 'How it works', 'Reviews', 'FAQ'].map((l) => (
                        <a
                            key={l}
                            href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
                            className="font-sans text-sm tracking-wide no-underline transition-opacity hover:opacity-60"
                            style={{ color: '#5F5E5A' }}
                        >
                            {l}
                        </a>
                    ))}
                </div>

                <a
                    href={WA_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="hidden md:inline-flex items-center gap-2 font-sans text-sm font-medium rounded-full px-5 py-2 text-white no-underline transition-all hover:-translate-y-px hover:brightness-90"
                    style={{ background: '#25D366' }}
                >
                    <WaIcon /> Chat with us
                </a>

                {/* Hamburger */}
                <button
                    className="md:hidden bg-transparent border-0 p-1 cursor-pointer"
                    onClick={() => setMenuOpen((m) => !m)}
                    aria-label="Toggle menu"
                >
                    <svg
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke={C.p600}
                        strokeWidth="2"
                        strokeLinecap="round"
                    >
                        {menuOpen ? (
                            <>
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </>
                        ) : (
                            <>
                                <line x1="3" y1="6" x2="21" y2="6" />
                                <line x1="3" y1="12" x2="21" y2="12" />
                                <line x1="3" y1="18" x2="21" y2="18" />
                            </>
                        )}
                    </svg>
                </button>

                {/* Mobile menu */}
                {menuOpen && (
                    <div
                        className="absolute top-full left-0 right-0 flex flex-col md:hidden border-b z-50"
                        style={{ background: 'rgba(245,244,254,0.98)', borderColor: C.p200 }}
                    >
                        {['Services', 'How it works', 'Reviews', 'FAQ'].map((l) => (
                            <a
                                key={l}
                                href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
                                className="font-sans text-sm px-6 py-4 border-b no-underline"
                                style={{ color: '#5F5E5A', borderColor: C.p100 }}
                                onClick={() => setMenuOpen(false)}
                            >
                                {l}
                            </a>
                        ))}
                        <div className="px-6 py-4">
                            <a
                                href={WA_URL}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-2 font-sans text-sm font-medium rounded-full px-5 py-2.5 text-white no-underline"
                                style={{ background: '#25D366' }}
                            >
                                <WaIcon /> Book via WhatsApp
                            </a>
                        </div>
                    </div>
                )}
            </nav>

            {/* overflow-x-hidden lives here, NOT on the root — putting it on a sticky element's ancestor breaks sticky */}
            <div className="overflow-x-hidden">
                {/* ══════════════
          HERO
      ══════════════ */}
                <section className="relative px-6 md:px-16 pt-20 pb-16 max-w-7xl mx-auto">
                    {/* Background blobs */}
                    <div
                        className="absolute -top-24 right-0 w-96 h-96 rounded-full opacity-40 pointer-events-none"
                        style={{ background: C.p100 }}
                    />
                    <div
                        className="absolute bottom-0 left-8 w-44 h-44 rounded-full opacity-50 pointer-events-none"
                        style={{ background: C.t50 }}
                    />

                    <div className="relative grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        {/* Left content */}
                        <div className={fadeIn()}>
                            <div
                                className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-7 border"
                                style={{ background: C.p100, borderColor: C.p200 }}
                            >
                                <span
                                    className="w-2 h-2 rounded-full shimmer"
                                    style={{ background: '#1D9E75' }}
                                />
                                <span
                                    className="font-sans text-[11px] font-medium uppercase tracking-widest"
                                    style={{ color: C.p600 }}
                                >
                                    Trusted in Nellore
                                </span>
                            </div>

                            <h1
                                className="font-serif font-light leading-[1.05] tracking-tight mb-5 text-5xl md:text-6xl"
                                style={{ color: C.p700 }}
                            >
                                Your home,
                                <br />
                                <em className="italic font-normal" style={{ color: C.p400 }}>
                                    perfectly cared for.
                                </em>
                            </h1>

                            <p
                                className="font-sans text-base leading-relaxed mb-9 max-w-md font-light"
                                style={{ color: '#5F5E5A' }}
                            >
                                Book vetted cleaning, plumbing, electrical, and more — in minutes.
                                Real professionals. Real results.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href={WA_URL}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center gap-2 font-sans font-medium text-sm rounded-full px-7 py-3.5 text-white no-underline transition-all hover:-translate-y-0.5 hover:brightness-90"
                                    style={{
                                        background: '#25D366',
                                        boxShadow: '0 6px 20px rgba(37,211,102,0.3)',
                                    }}
                                >
                                    <WaIcon /> Book via WhatsApp
                                </a>
                                <a
                                    href={WA_URL}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center justify-center font-sans text-sm font-normal rounded-full px-7 py-3.5 bg-transparent border cursor-pointer transition-all hover:-translate-y-0.5 hover:opacity-80"
                                    style={{ borderColor: C.p300, color: C.p600 }}
                                >
                                    Become a Pro
                                </a>
                            </div>

                            <div
                                className="flex flex-wrap gap-8 mt-10 pt-8 border-t"
                                style={{ borderColor: C.p200 }}
                            >
                                {[
                                    ['500+', 'Happy clients'],
                                    ['4.9★', 'Average rating'],
                                    ['2hr', 'Avg. response'],
                                ].map(([n, l]) => (
                                    <div key={l}>
                                        <div
                                            className="font-serif text-3xl font-semibold leading-none"
                                            style={{ color: C.p600 }}
                                        >
                                            {n}
                                        </div>
                                        <div
                                            className="font-sans text-xs mt-1 tracking-wide uppercase"
                                            style={{ color: '#888780' }}
                                        >
                                            {l}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right — floating cards, desktop only */}
                        <div
                            className={`hidden md:flex justify-center items-center ${fadeIn('delay-150')}`}
                        >
                            <div className="relative w-[340px] h-[360px]">
                                <div
                                    className="absolute top-0 left-0 w-56 rounded-2xl p-6 text-white float"
                                    style={{ background: C.p600 }}
                                >
                                    <div className="text-2xl mb-2">⬡</div>
                                    <div className="font-serif text-lg">Expert Electrician</div>
                                    <div
                                        className="font-sans text-xs mt-1 opacity-80"
                                        style={{ color: C.p200 }}
                                    >
                                        Available today · 2hr slots
                                    </div>
                                </div>
                                <div
                                    className="absolute top-28 right-0 w-52 rounded-2xl p-5 border float2"
                                    style={{ background: '#fff', borderColor: C.p200 }}
                                >
                                    <div
                                        className="font-sans text-[10px] font-medium uppercase tracking-widest mb-1.5"
                                        style={{ color: C.p500 }}
                                    >
                                        Last booking
                                    </div>
                                    <div
                                        className="font-serif text-base font-semibold"
                                        style={{ color: C.p700 }}
                                    >
                                        Deep Cleaning
                                    </div>
                                    <div className="flex gap-0.5 mt-2">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <span
                                                key={i}
                                                className="text-sm"
                                                style={{ color: C.p400 }}
                                            >
                                                ★
                                            </span>
                                        ))}
                                    </div>
                                    <div
                                        className="font-sans text-xs mt-1"
                                        style={{ color: '#888780' }}
                                    >
                                        "Absolutely spotless!"
                                    </div>
                                </div>
                                <div
                                    className="absolute bottom-0 left-5 w-64 rounded-2xl p-5 border"
                                    style={{ background: C.t50, borderColor: C.t200 }}
                                >
                                    <div
                                        className="font-sans text-[10px] font-medium uppercase tracking-widest mb-1"
                                        style={{ color: C.t600 }}
                                    >
                                        Verified Pro
                                    </div>
                                    <div
                                        className="font-serif text-xl font-semibold"
                                        style={{ color: '#085041' }}
                                    >
                                        Background checked ✓
                                    </div>
                                    <div
                                        className="font-sans text-xs mt-1"
                                        style={{ color: C.t600 }}
                                    >
                                        All pros vetted & insured
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ══════════════
          HOW IT WORKS
      ══════════════ */}
                <section id="how-it-works" className="px-6 md:px-16 py-20 max-w-7xl mx-auto">
                    <div className="mb-12">
                        <SectionLabel>Simple process</SectionLabel>
                        <SectionHeading>How it works</SectionHeading>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {steps.map((s, i) => (
                            <div
                                key={i}
                                className="relative overflow-hidden rounded-2xl p-8 bg-white border transition-transform hover:-translate-y-1"
                                style={{ borderColor: C.p100 }}
                            >
                                <span
                                    className="absolute top-4 right-5 font-serif text-6xl font-light select-none pointer-events-none"
                                    style={{ color: C.p100 }}
                                >
                                    {s.num}
                                </span>
                                <div
                                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-5 border"
                                    style={{
                                        background: C.p50,
                                        borderColor: C.p200,
                                        color: C.p500,
                                    }}
                                >
                                    {['✦', '◈', '⬡'][i]}
                                </div>
                                <h3
                                    className="font-serif text-xl font-semibold mb-2"
                                    style={{ color: C.p700 }}
                                >
                                    {s.title}
                                </h3>
                                <p
                                    className="font-sans text-sm leading-relaxed font-light"
                                    style={{ color: '#5F5E5A' }}
                                >
                                    {s.desc}
                                </p>
                                <div
                                    className="mt-6 h-0.5 w-10 rounded-full"
                                    style={{ background: s.accent }}
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══════════════
          SERVICES
      ══════════════ */}
                <section id="services" className="bg-white px-6 md:px-16 py-20">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-12">
                            <SectionLabel>What we offer</SectionLabel>
                            <SectionHeading>Our services</SectionHeading>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {services.map((s, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center justify-between rounded-2xl px-6 py-5 border transition-all
                  ${s.live ? 'hover:-translate-y-1 hover:bg-white cursor-pointer' : 'opacity-60 cursor-default'}`}
                                    style={{ background: C.p50, borderColor: C.p100 }}
                                >
                                    <div className="flex items-center gap-4">
                                        <span className="text-xl" style={{ color: C.p400 }}>
                                            {s.icon}
                                        </span>
                                        <span
                                            className="font-serif text-lg font-semibold"
                                            style={{ color: C.p700 }}
                                        >
                                            {s.name}
                                        </span>
                                    </div>
                                    {s.live ? (
                                        <span
                                            className="font-sans text-[11px] font-medium rounded-full px-3 py-1 border whitespace-nowrap"
                                            style={{
                                                background: C.t50,
                                                color: C.t600,
                                                borderColor: C.t200,
                                            }}
                                        >
                                            Available
                                        </span>
                                    ) : (
                                        <span
                                            className="font-sans text-[11px] font-medium rounded-full px-3 py-1 border whitespace-nowrap"
                                            style={{
                                                background: C.p100,
                                                color: C.p500,
                                                borderColor: C.p200,
                                            }}
                                        >
                                            Coming soon
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ══════════════
          REVIEWS
      ══════════════ */}
                <section id="reviews" className="px-6 md:px-16 py-20 max-w-7xl mx-auto">
                    <div className="mb-12">
                        <SectionLabel>Client voices</SectionLabel>
                        <SectionHeading>What customers say</SectionHeading>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {reviews.map((r, i) => (
                            <div
                                key={i}
                                className="rounded-2xl p-8 bg-white border"
                                style={{ borderColor: C.p100 }}
                            >
                                <div className="flex gap-0.5 mb-4">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <span key={s} className="text-sm" style={{ color: C.p400 }}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <p
                                    className="font-serif text-lg italic leading-relaxed mb-5"
                                    style={{ color: C.p700 }}
                                >
                                    "{r.text}"
                                </p>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-9 h-9 rounded-full flex items-center justify-center font-sans text-xs font-medium shrink-0"
                                        style={{ background: C.p200, color: C.p700 }}
                                    >
                                        {r.name[0]}
                                    </div>
                                    <div>
                                        <div
                                            className="font-sans text-sm font-medium"
                                            style={{ color: '#2C2C2A' }}
                                        >
                                            {r.name}
                                        </div>
                                        <div
                                            className="font-sans text-xs"
                                            style={{ color: '#888780' }}
                                        >
                                            {r.role}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══════════════
          FAQ
      ══════════════ */}
                <section id="faq" className="bg-white px-6 md:px-16 py-20">
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-12">
                            <SectionLabel>Questions</SectionLabel>
                            <SectionHeading>Frequently asked</SectionHeading>
                        </div>
                        {faqs.map((f, i) => (
                            <div key={i} className="border-b" style={{ borderColor: C.p100 }}>
                                <button
                                    className="w-full text-left flex justify-between items-center py-5 font-serif text-lg font-semibold bg-transparent border-0 cursor-pointer transition-colors"
                                    style={{ color: open === i ? C.p500 : C.p700 }}
                                    onClick={() => setOpen(open === i ? null : i)}
                                >
                                    {f.q}
                                    <span
                                        className="text-2xl font-light ml-4 shrink-0 transition-transform duration-200 inline-block"
                                        style={{
                                            color: C.p300,
                                            transform:
                                                open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                                        }}
                                    >
                                        +
                                    </span>
                                </button>
                                {open === i && (
                                    <p
                                        className="font-sans text-sm leading-relaxed pb-5 font-light"
                                        style={{ color: '#5F5E5A' }}
                                    >
                                        {f.a}
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* ══════════════
          CTA
      ══════════════ */}
                <section
                    className="relative overflow-hidden px-6 py-24 text-center"
                    style={{ background: C.p700 }}
                >
                    <div
                        className="absolute -top-16 -right-16 w-80 h-80 rounded-full opacity-40 pointer-events-none"
                        style={{ background: C.p600 }}
                    />
                    <div
                        className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full opacity-30 pointer-events-none"
                        style={{ background: C.p500 }}
                    />

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <p
                            className="font-sans text-xs font-medium uppercase tracking-widest mb-4"
                            style={{ color: C.p300 }}
                        >
                            Ready to start?
                        </p>
                        <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight tracking-tight mb-4 text-white">
                            Your home deserves
                            <br />
                            <em className="italic font-normal" style={{ color: C.p200 }}>
                                the best care.
                            </em>
                        </h2>
                        <p
                            className="font-sans text-base leading-relaxed mb-10 font-light max-w-md mx-auto"
                            style={{ color: C.p300 }}
                        >
                            Message us on WhatsApp and we'll have you booked within minutes.
                        </p>
                        <a
                            href={WA_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-3 font-sans font-medium text-base rounded-full px-8 py-4 text-white no-underline transition-all hover:-translate-y-0.5 hover:brightness-90"
                            style={{
                                background: '#25D366',
                                boxShadow: '0 8px 28px rgba(37,211,102,0.4)',
                            }}
                        >
                            <WaIcon size={18} /> Book Now on WhatsApp
                        </a>
                    </div>
                </section>

                {/* ══════════════
          FOOTER
      ══════════════ */}
                <footer
                    className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 md:px-16 py-6 border-t"
                    style={{ background: C.p700, borderColor: C.p600 }}
                >
                    <span className="font-serif text-lg" style={{ color: C.p300 }}>
                        Home Hero
                    </span>
                    <span className="font-sans text-xs" style={{ color: C.p400 }}>
                        © 2026 Home Hero. All rights reserved.
                    </span>
                    <a
                        href={WA_URL}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-sans text-xs no-underline"
                        style={{ color: '#25D366' }}
                    >
                        <WaIcon size={12} /> +91 8686 77 9278
                    </a>
                </footer>
            </div>
            {/* end overflow-x-hidden wrapper */}
        </div>
    );
}
