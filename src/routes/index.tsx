import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Phone, MapPin, Instagram, MessageCircle, Star, Music, Users, Heart, Sparkles, ExternalLink, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { InstagramEmbed } from "@/components/InstagramEmbed";
import { useMedia } from "@/hooks/use-media";
import tinyTots from "@/assets/tiny-tots.jpg";
import juniors from "@/assets/juniors.jpg";
import teensAdults from "@/assets/teens-adults.jpg";
import chaitanya from "@/assets/chaitanya.jpg";
import groupDance from "@/assets/group-dance.jpg";
import freestyleDance from "@/assets/freestyle-dance.jpg";
import dansvillaNeon from "@/assets/dansvilla-neon-sign.jpg";

// Real Instagram posts from @dansvilla_studio — add more URLs here anytime
const INSTAGRAM_POSTS: string[] = [
  "https://www.instagram.com/dansvilla_studio/p/DKTCr8jpj29/",
];

const INSTAGRAM_URL = "https://www.instagram.com/dansvilla_studio/";
const GOOGLE_REVIEWS_URL = "https://maps.app.goo.gl/Zdo8BycCBqZErtNn8";

const PHONE = "16132189417";
const wa = (msg: string) => `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;

const MSG = {
  general: "Hi Chaitanya Master, I'm interested in joining Dansvilla Studio dance classes.",
  monthly: "Hi Chaitanya Master, I'd like to register for the Monthly plan ($60/month). Please share next steps.",
  threeMonths: "Hi Chaitanya Master, I'd like to register for the 3-Month plan ($150 total). Please share next steps.",
  family: "Hi Chaitanya Master, I'd like to register for the Family/Duo plan ($50/person/month). We are 2 people joining together. Please share next steps.",
  about: "Hi Chaitanya Master, I'd love to know more about your classes at Dansvilla Studio.",
  batch: (name: string, time: string, age: string) =>
    `Hi Chaitanya Master, I'd like to register for the ${name} batch (${time}, ${age}) at Dansvilla Studio.`,
};

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Dansvilla Studio — Bollywood, Tollywood & Freestyle Dance Classes in Nepean" },
      { name: "description", content: "Join Dansvilla Studio in Barrhaven/Nepean for Bollywood, Tollywood, Kollywood & Freestyle dance classes for kids, teens & adults. Limited spots — register now." },
      { property: "og:title", content: "Dansvilla Studio — Dance Classes in Nepean" },
      { property: "og:description", content: "Bollywood · Tollywood · Kollywood · Freestyle. All ages welcome." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
});

function Index() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-3">
          <a href="#top" className="flex items-center gap-2 shrink-0">
            <img src={dansvillaNeon} alt="The Dansvilla Studio neon sign" width={120} height={48} className="h-9 md:h-10 w-auto object-contain drop-shadow-[0_0_10px_var(--neon-pink)]" />
          </a>
          <nav className="hidden md:flex gap-8 text-sm font-medium">
            <a href="#schedule" className="hover:text-[var(--neon-cyan)] transition">Schedule</a>
            <a href="#pricing" className="hover:text-[var(--neon-cyan)] transition">Pricing</a>
            <a href="#about" className="hover:text-[var(--neon-cyan)] transition">About</a>
            <a href="#contact" className="hover:text-[var(--neon-cyan)] transition">Contact</a>
          </nav>
          <div className="flex items-center gap-2">
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <Button size="icon" variant="outline" className="neon-cyan-border bg-transparent text-[var(--neon-pink)] hover:bg-[var(--neon-pink)] hover:text-white">
                <Instagram className="size-4" />
              </Button>
            </a>
            <a href={wa(MSG.general)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <Button className="bg-[oklch(0.65_0.18_150)] hover:bg-[oklch(0.6_0.18_150)] text-white beat-pulse">
                <MessageCircle className="size-4" /> <span className="hidden sm:inline">WhatsApp</span>
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section id="top" ref={heroRef} className="relative pt-16 min-h-screen flex items-center overflow-hidden">
        {/* clean dark background — no AI photo, no filters */}
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(255,43,209,0.18), transparent 50%), radial-gradient(circle at 80% 70%, rgba(0,229,255,0.15), transparent 55%)",
          }}
        />
        <div className="absolute inset-0 spotlight" />

        {/* Floating music notes */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 8 }).map((_, i) => (
            <Music
              key={i}
              className="floating-note size-6"
              style={{
                left: `${(i * 13 + 5) % 95}%`,
                animationDuration: `${10 + (i % 4) * 3}s`,
                animationDelay: `${i * 1.5}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/15 border border-[var(--neon-pink)] text-[var(--neon-pink)] text-xs font-semibold tracking-widest mb-6 neon-flicker">
              <Sparkles className="size-3" /> LIMITED SPOTS · REGISTER NOW
            </div>
            <h1 className="font-display text-5xl md:text-8xl leading-[0.95] neon-title">
              THE DANSVILLA<br />STUDIO
            </h1>
            <p className="mt-4 text-lg md:text-xl font-semibold tracking-wider text-foreground/90">
              <span className="neon-text-cyan">BOLLYWOOD</span> · <span className="neon-text-pink">TOLLYWOOD</span> · <span className="neon-text-cyan">KOLLYWOOD</span> · <span className="neon-text-pink">FREESTYLE</span>
            </p>
            <p className="mt-6 text-base text-muted-foreground max-w-lg">
              Dance classes for every age and every level — taught with energy, heart, and a little bit of filmy magic by Chaitanya Master in Barrhaven, Nepean.
            </p>

            {/* $15 per class highlight */}
            <div className="mt-8 inline-flex items-stretch rounded-2xl overflow-hidden border-2 border-[var(--neon-gold)] shadow-[0_0_25px_rgba(255,209,102,0.45)] bg-background/60 backdrop-blur">
              <div className="px-5 py-3 bg-[var(--neon-gold)]/15 flex items-center">
                <Sparkles className="size-5 text-[var(--neon-gold)]" />
              </div>
              <div className="px-5 py-3">
                <p className="text-[10px] tracking-[0.25em] text-muted-foreground font-semibold">DROP-IN RATE</p>
                <p className="font-display text-3xl md:text-4xl leading-none" style={{ color: "var(--neon-gold)", textShadow: "0 0 10px var(--neon-gold)" }}>
                  $15 <span className="text-base text-foreground/80">PER CLASS</span>
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href={wa(MSG.general)} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-primary hover:bg-primary/90 beat-pulse">
                  <MessageCircle /> Register on WhatsApp
                </Button>
              </a>
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-[var(--neon-pink)] bg-transparent text-[var(--neon-pink)] hover:bg-[var(--neon-pink)] hover:text-white">
                  <Instagram /> Instagram
                </Button>
              </a>
              <a href={`tel:+${PHONE}`}>
                <Button size="lg" variant="outline" className="neon-cyan-border bg-transparent text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)] hover:text-background">
                  <Phone /> 613-218-9417
                </Button>
              </a>
            </div>
          </div>

          {/* Swipe carousel: studio photos + google reviews */}
          <div className="flex justify-center md:justify-end">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-6 bg-[var(--neon-pink)]/30 blur-3xl rounded-full" />
              <div className="relative rounded-3xl overflow-hidden neon-border bg-card">
                <HeroSwipe />
              </div>
              <p className="mt-3 text-center text-xs tracking-widest text-muted-foreground">
                ← SWIPE · STUDIO MOMENTS & REVIEWS →
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="relative py-5 border-y border-[var(--neon-pink)]/40 bg-background/60 overflow-hidden">
        <div className="neon-divider absolute top-0 inset-x-0" />
        <div className="neon-divider absolute bottom-0 inset-x-0" />
        <div className="marquee-track font-display text-3xl md:text-5xl tracking-widest">
          {Array.from({ length: 2 }).map((_, k) => (
            <span key={k} className="flex items-center gap-8 px-4">
              {["BOLLYWOOD", "TOLLYWOOD", "KOLLYWOOD", "FREESTYLE", "DANSVILLA", "BOLLYWOOD", "TOLLYWOOD", "KOLLYWOOD", "FREESTYLE", "DANSVILLA"].map((w, i) => (
                <span key={i} className="flex items-center gap-8">
                  <span className={i % 2 === 0 ? "neon-text-pink" : "neon-text-cyan"}>{w}</span>
                  <Sparkles className="size-6 text-[var(--neon-gold)]" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* SCHEDULE */}
      <section id="schedule" className="py-24 px-6 reveal-on-scroll">
        <div className="max-w-7xl mx-auto">
          <SectionTitle eyebrow="Class Schedule" title="DANCE WITH US" subtitle="Weekday and weekend batches for every age." />

          {/* Weekend Batches */}
          <div className="mt-14">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] border border-[var(--neon-cyan)]">WEEKEND BATCHES</span>
              <span className="h-px flex-1 bg-gradient-to-r from-[var(--neon-cyan)]/60 to-transparent" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <BatchCard img={tinyTots} time="11–12 PM" name="Tiny Tots" age="Ages 3–7" />
              <BatchCard img={juniors} time="12–1 PM" name="Juniors" age="Ages 8–12" />
              <BatchCard img={teensAdults} time="1–2 PM" name="Teens & Adults" age="Beginner · 13+" />
              <BatchCard img={groupDance} time="2–3 PM" name="Teens & Adults" age="Advanced · 13+" />
            </div>
          </div>

          {/* Weekday Batches */}
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 rounded-full text-xs font-bold tracking-widest bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] border border-[var(--neon-pink)]">WEEKDAY BATCHES</span>
              <span className="h-px flex-1 bg-gradient-to-r from-[var(--neon-pink)]/60 to-transparent" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-8 bg-card border-border tilt-on-hover">
                <div className="flex items-center gap-3 mb-2">
                  <Music className="text-[var(--neon-pink)]" />
                  <h3 className="text-2xl">Monday — Bollywood</h3>
                </div>
                <p className="text-muted-foreground mb-4">High-energy Bollywood choreography across three age batches.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between border-b border-border pb-2"><span>Tiny Tots (3–7)</span><span className="neon-text-cyan">5–6 PM</span></li>
                  <li className="flex justify-between border-b border-border pb-2"><span>Juniors (8–12)</span><span className="neon-text-cyan">6–7 PM</span></li>
                  <li className="flex justify-between"><span>Teens & Adults (13+)</span><span className="neon-text-cyan">7–8 PM</span></li>
                </ul>
              </Card>
              <Card className="p-8 bg-card border-border tilt-on-hover">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="text-[var(--neon-cyan)]" />
                  <h3 className="text-2xl">Wednesday — Freestyle</h3>
                </div>
                <p className="text-muted-foreground mb-4">Hip-hop infused freestyle and contemporary moves.</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between border-b border-border pb-2"><span>Tiny Tots (3–7)</span><span className="neon-text-pink">5–6 PM</span></li>
                  <li className="flex justify-between border-b border-border pb-2"><span>Juniors (8–12)</span><span className="neon-text-pink">6–7 PM</span></li>
                  <li className="flex justify-between"><span>Teens & Adults (13+)</span><span className="neon-text-pink">7–8 PM</span></li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <div className="neon-divider mx-6 md:mx-24" />

      {/* PRICING */}
      <section id="pricing" className="py-24 px-6 bg-secondary/40 reveal-on-scroll relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" style={{
          background: "radial-gradient(circle at 20% 30%, var(--neon-pink) 0%, transparent 40%), radial-gradient(circle at 80% 70%, var(--neon-cyan) 0%, transparent 40%)"
        }} />
        <div className="max-w-7xl mx-auto relative">
          <SectionTitle eyebrow="Pricing" title="SIMPLE & FAIR" subtitle="Pick what works for your family." />
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <PriceCard title="Monthly" price="$60" sub="/ month" perks={["4 classes per month", "One dance style", "Cancel anytime"]} waMessage={MSG.monthly} />
            <PriceCard title="3 Months" price="$150" sub="total · save $30" perks={["12 classes (3 months)", "Best value", "One dance style"]} highlighted badge="MOST POPULAR" waMessage={MSG.threeMonths} />
            <PriceCard title="Family / Duo" price="$50" sub="/ person / month" perks={["Siblings · Parent & Child · Couples", "Valid when 2 join together", "Save together, dance together"]} icon={<Heart className="size-5" />} waMessage={MSG.family} />
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">All prices in CAD. Limited spots available each session.</p>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-24 px-6 reveal-on-scroll">
        <div className="max-w-7xl mx-auto">
          <SectionTitle eyebrow="Why Dansvilla" title="MORE THAN A CLASS" />
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Benefit icon={<Users />} title="All Ages, All Levels" desc="From 3-year-olds to grown-ups — everyone has a batch." />
            <Benefit icon={<Music />} title="4 Dance Styles" desc="Bollywood, Tollywood, Kollywood and Freestyle under one roof." />
            <Benefit icon={<Heart />} title="Family Friendly" desc="Bring a sibling, a child, or your partner and save together." />
            <Benefit icon={<Sparkles />} title="Beginner Welcome" desc="No prior experience needed — just show up and have fun." />
            <Benefit icon={<Star />} title="5★ Rated Studio" desc="Loved by our students and their families on Google." />
            <Benefit icon={<MapPin />} title="Right in Barrhaven" desc="Easy to reach — 131 Harbour View St, Nepean." />
          </div>
        </div>
      </section>

      <div className="neon-divider mx-6 md:mx-24" />

      {/* TESTIMONIALS */}
      <section className="py-24 px-6 bg-secondary/40 reveal-on-scroll">
        <div className="max-w-7xl mx-auto">
          <SectionTitle eyebrow="Loved by Families" title="WHAT STUDENTS SAY" subtitle="Our 5★ Google rating, in their words." />
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Testimonial quote="Chaitanya Master is incredibly patient and energetic. My daughter loves every class — she dances around the house all week!" name="Parent · Tiny Tots" />
            <Testimonial quote="Best dance studio in Barrhaven. The choreography is fresh, the vibe is fun, and you genuinely improve. Highly recommend." name="Adult Student" />
            <Testimonial quote="Joined as a complete beginner. Within a few months I was performing on stage with confidence. Thank you Dansvilla!" name="Teen Student" />
          </div>
          <div className="mt-10 text-center">
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="neon-cyan-border bg-transparent text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)] hover:text-background">
                <Star className="size-4" /> More reviews on Google <ExternalLink className="size-3" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ABOUT CHAITANYA */}
      <section id="about" className="py-24 px-6 reveal-on-scroll">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-10 items-center">
          <div className="md:col-span-2 relative">
            <div className="absolute -inset-4 bg-[var(--neon-pink)]/40 blur-3xl rounded-full" />
            <img src={chaitanya} alt="Chaitanya Master, founder of Dansvilla Studio" loading="lazy" width={600} height={600}
              className="relative rounded-3xl object-cover aspect-square w-full neon-border" />
          </div>
          <div className="md:col-span-3">
            <p className="neon-text-cyan text-xs font-semibold tracking-widest mb-3">MEET YOUR INSTRUCTOR</p>
            <h2 className="text-5xl md:text-6xl">CHAITANYA <span className="neon-text-pink">MASTER</span></h2>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
              Chaitanya Master is the heart and energy behind Dansvilla Studio. With years of experience choreographing across Bollywood, Tollywood, Kollywood and freestyle styles, he's known for making every student — whether 3 or 53 — feel like a star on the floor.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              His classes blend technique, expression and a whole lot of fun. Expect crisp choreography, encouraging vibes, and stage-ready confidence by the end of every season.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={wa(MSG.about)} target="_blank" rel="noopener noreferrer">
                <Button className="bg-primary hover:bg-primary/90 beat-pulse"><MessageCircle /> Message Chaitanya Master</Button>
              </a>
              <a href="https://www.instagram.com/dansvilla_studio/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="neon-cyan-border bg-transparent text-[var(--neon-cyan)] hover:bg-[var(--neon-cyan)] hover:text-background"><Instagram /> Follow on Instagram</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24 px-6 bg-secondary/40 reveal-on-scroll">
        <div className="max-w-7xl mx-auto">
          <SectionTitle eyebrow="Visit Us" title="COME DANCE WITH US" />
          <div className="grid md:grid-cols-2 gap-8 mt-12">
            <Card className="p-8 bg-card border-border space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-[var(--neon-pink)] shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl mb-1">Studio Location</h3>
                  <p className="text-muted-foreground">131 Harbour View St, Nepean (Strandherd / Barrhaven), ON K2G 6Z8</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone className="text-[var(--neon-cyan)] shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl mb-1">Call Chaitanya Master</h3>
                  <a href={`tel:+${PHONE}`} className="text-muted-foreground hover:text-[var(--neon-cyan)]">+1 613-218-9417</a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Instagram className="text-[var(--neon-pink)] shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl mb-1">Instagram</h3>
                  <a href="https://www.instagram.com/dansvilla_studio/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[var(--neon-pink)]">@dansvilla_studio</a>
                </div>
              </div>
              <a href={wa(MSG.general)} target="_blank" rel="noopener noreferrer" className="block">
                <Button size="lg" className="w-full bg-[oklch(0.65_0.18_150)] hover:bg-[oklch(0.6_0.18_150)] text-white beat-pulse">
                  <MessageCircle /> Register Now on WhatsApp
                </Button>
              </a>
            </Card>
            <div className="rounded-xl overflow-hidden neon-cyan-border min-h-[400px]">
              <iframe
                title="Dansvilla Studio location"
                src="https://www.google.com/maps?q=131+Harbour+View+St,+Nepean,+ON+K2G+6Z8&output=embed"
                className="w-full h-full min-h-[400px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <img src={dansvillaNeon} alt="The Dansvilla Studio" width={140} height={56} className="h-10 w-auto object-contain drop-shadow-[0_0_10px_var(--neon-pink)]" />
          <p>© {new Date().getFullYear()} Dansvilla Studio · Nepean, Ontario</p>
          <div className="flex gap-4">
            <a href="https://www.instagram.com/dansvilla_studio/" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--neon-pink)]"><Instagram className="size-5" /></a>
            <a href={`tel:+${PHONE}`} className="hover:text-[var(--neon-cyan)]"><Phone className="size-5" /></a>
            <a href={wa(MSG.general)} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--neon-pink)]"><MessageCircle className="size-5" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <p className="neon-text-cyan text-xs font-semibold tracking-widest mb-3">{eyebrow.toUpperCase()}</p>
      <h2 className="text-5xl md:text-6xl">{title}</h2>
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}

function BatchCard({ img, time, name, age }: { img: string; time: string; name: string; age: string }) {
  return (
    <a
      href={wa(MSG.batch(name, time, age))}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative rounded-2xl overflow-hidden border border-border bg-card block tilt-on-hover"
    >
      <img src={img} alt={name} loading="lazy" width={600} height={600} className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 p-5">
        <p className="neon-text-cyan font-display text-2xl tracking-wider">{time}</p>
        <h3 className="text-2xl mt-1">{name}</h3>
        <p className="text-sm text-muted-foreground">{age}</p>
        <p className="mt-3 inline-flex items-center gap-1 text-xs font-semibold neon-text-pink opacity-0 group-hover:opacity-100 transition">
          <MessageCircle className="size-3" /> Register this batch
        </p>
      </div>
    </a>
  );
}

function PriceCard({ title, price, sub, perks, highlighted, badge, icon, waMessage }: { title: string; price: string; sub: string; perks: string[]; highlighted?: boolean; badge?: string; icon?: React.ReactNode; waMessage: string }) {
  return (
    <Card className={`relative p-8 border-2 transition ${highlighted ? "neon-border bg-card scale-105" : "border-border bg-card hover:neon-cyan-border"}`}>
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[var(--neon-pink)] text-white text-xs font-bold tracking-widest shadow-[0_0_20px_var(--neon-pink)]">
          {badge}
        </div>
      )}
      <div className="flex items-center gap-2 neon-text-cyan mb-2">{icon}<p className="text-sm font-semibold tracking-widest uppercase">{title}</p></div>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-6xl text-foreground">{price}</span>
        <span className="text-muted-foreground text-sm">{sub}</span>
      </div>
      <ul className="mt-6 space-y-3 text-sm">
        {perks.map((p) => (
          <li key={p} className="flex gap-2"><Star className="size-4 text-[var(--neon-gold)] shrink-0 mt-0.5" />{p}</li>
        ))}
      </ul>
      <a href={wa(waMessage)} target="_blank" rel="noopener noreferrer" className="block mt-6">
        <Button className={`w-full ${highlighted ? "bg-primary hover:bg-primary/90 beat-pulse" : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"}`}>
          <MessageCircle /> Register {title}
        </Button>
      </a>
    </Card>
  );
}

function Benefit({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="p-6 bg-card border-border hover:neon-cyan-border transition tilt-on-hover">
      <div className="size-12 rounded-xl bg-[var(--neon-pink)]/15 text-[var(--neon-pink)] flex items-center justify-center mb-4" style={{ filter: "drop-shadow(0 0 8px var(--neon-pink))" }}>{icon}</div>
      <h3 className="text-xl mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </Card>
  );
}

function Testimonial({ quote, name }: { quote: string; name: string }) {
  return (
    <Card className="p-6 bg-card border-border tilt-on-hover">
      <div className="flex gap-1 text-[var(--neon-gold)] mb-3" style={{ filter: "drop-shadow(0 0 6px var(--neon-gold))" }}>
        {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="size-4 fill-current" />)}
      </div>
      <p className="text-foreground/90 italic leading-relaxed">"{quote}"</p>
      <p className="mt-4 text-sm text-muted-foreground font-semibold">— {name}</p>
    </Card>
  );
}

function HeroSwipe() {
  const slides: Array<
    | { type: "photo"; src: string; alt: string; caption: string }
    | { type: "review"; quote: string; name: string }
  > = [
    { type: "photo", src: groupDance, alt: "Bollywood group performance at Dansvilla Studio", caption: "Group performance · @dansvilla_studio" },
    { type: "review", quote: "Chaitanya Master is incredibly patient and the kids LOVE his classes. Best studio in Barrhaven!", name: "Google Review · ★★★★★" },
    { type: "photo", src: freestyleDance, alt: "Freestyle dancer mid-leap", caption: "Freestyle batch · @dansvilla_studio" },
    { type: "review", quote: "Amazing energy, brilliant choreography. My daughter cannot wait for every class.", name: "Google Review · ★★★★★" },
    { type: "photo", src: teensAdults, alt: "Teens and adults dance class", caption: "Teens & Adults · @dansvilla_studio" },
    { type: "review", quote: "Joined as a complete beginner — felt welcomed from day one. Highly recommend!", name: "Google Review · ★★★★★" },
  ];

  return (
    <Carousel
      opts={{ loop: true, align: "start" }}
      plugins={[Autoplay({ delay: 3800, stopOnInteraction: false, stopOnMouseEnter: true })]}
      className="w-full"
    >
      <CarouselContent>
        {slides.map((s, i) => (
          <CarouselItem key={i} className="basis-full">
            {s.type === "photo" ? (
              <div className="relative aspect-square w-full">
                <img src={s.src} alt={s.alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-background/90 to-transparent">
                  <div className="flex items-center gap-2 text-xs">
                    <Instagram className="size-4 text-[var(--neon-pink)]" />
                    <span className="text-foreground/90 font-medium">{s.caption}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative aspect-square w-full flex flex-col justify-center p-6 md:p-8 bg-gradient-to-br from-[var(--neon-pink)]/15 via-card to-[var(--neon-cyan)]/15">
                <div className="flex gap-1 text-[var(--neon-gold)] mb-3" style={{ filter: "drop-shadow(0 0 6px var(--neon-gold))" }}>
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} className="size-4 fill-current" />)}
                </div>
                <p className="text-foreground/95 italic leading-relaxed text-base md:text-lg">"{s.quote}"</p>
                <p className="mt-4 text-xs font-semibold neon-text-cyan tracking-widest">{s.name}</p>
                <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-[var(--neon-cyan)] w-fit">
                  Read on Google <ExternalLink className="size-3" />
                </a>
              </div>
            )}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}

