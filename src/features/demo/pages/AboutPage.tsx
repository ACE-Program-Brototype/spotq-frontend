/**
 * About Us Page Component
 * Introduces the SpotQ platform, mission, core values, and hospitality ecosystem.
 */

import { ArrowRight, Clock, Heart, ShieldCheck, Sparkles, Store, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import spotqLogo from "@/assets/logos/spotq-logo.png";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function AboutPage() {
  const values = [
    {
      icon: Clock,
      title: "Zero Waiting Frustration",
      description:
        "Join restaurant waitlists remotely from your phone and receive real-time updates when your table is ready.",
    },
    {
      icon: Utensils,
      title: "Curated Dining Discovery",
      description:
        "Explore interactive digital menus, dietary options, and verified dining experiences across top local restaurants.",
    },
    {
      icon: Store,
      title: "Empowering Local Kitchens",
      description:
        "We equip restaurants with intelligent floor management, queue automation, and table turnaround insights.",
    },
    {
      icon: ShieldCheck,
      title: "Reliable & Transparent",
      description:
        "Accurate live estimates, secure digital ordering, and clear communication from kitchen to table.",
    },
  ];

  const metrics = [
    { label: "Partner Restaurants", value: "250+" },
    { label: "Happy Diners Served", value: "50,000+" },
    { label: "Average Wait Time Saved", value: "35 mins" },
    { label: "Customer Satisfaction", value: "99.4%" },
  ];

  return (
    <div className="flex flex-col gap-12 sm:gap-16 py-4 sm:py-8 select-none">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#fff7f0] to-[#fffdfb] border border-[#ffeedd] px-6 py-12 sm:px-12 sm:py-20 text-center shadow-xs">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#ff6b00]/10 px-3.5 py-1.5 text-xs font-bold text-[#ff6b00]">
            <Sparkles className="size-3.5" />
            <span>About SpotQ</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-neutral-900 leading-tight">
            Redefining the <span className="text-[#ff6b00]">Dining Experience</span>
          </h1>

          <p className="text-sm sm:text-base leading-relaxed text-neutral-600 max-w-2xl">
            SpotQ is built to eliminate the stress of physical waiting lines. We connect discerning
            diners with premier restaurants through intelligent virtual queueing, transparent wait
            times, and seamless hospitality.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold shadow-sm h-11 px-6",
              )}
            >
              <span>Explore Restaurants</span>
              <ArrowRight className="size-4 ml-1.5" />
            </Link>

            <Link
              to="/restaurant/email/verification"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full border-neutral-300 hover:bg-neutral-100 font-semibold h-11 px-6",
              )}
            >
              Partner With Us
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200/80 bg-white p-5 sm:p-6 text-center shadow-2xs"
          >
            <span className="text-2xl sm:text-4xl font-extrabold text-[#ff6b00] tracking-tight">
              {item.value}
            </span>
            <span className="mt-1 text-xs sm:text-sm font-medium text-neutral-500">
              {item.label}
            </span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Why Food Lovers & Restaurants Choose SpotQ
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-neutral-500">
            Our mission is simple: make every meal effortless from the moment you decide where to
            eat.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {values.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex flex-col gap-3 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-2xs transition-all hover:border-[#ff6b00]/30 hover:shadow-xs"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-[#ff6b00]/10 text-[#ff6b00]">
                  <Icon className="size-5.5" />
                </div>
                <h3 className="text-base font-bold text-neutral-900">{item.title}</h3>
                <p className="text-xs sm:text-sm leading-relaxed text-neutral-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center rounded-3xl border border-neutral-200/80 bg-white p-6 sm:p-12 shadow-xs">
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#ff6b00] uppercase tracking-wider">
            <Heart className="size-4" />
            <span>Our Story</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
            Crafted with passion for memorable culinary moments
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-neutral-600">
            Great food brings people together, but waiting in cramped lines or waiting endlessly for
            a table shouldn't stand in the way. SpotQ started with a vision to transform chaotic
            restaurant queues into effortless, calm experiences for diners and hosts alike.
          </p>
          <p className="text-xs sm:text-sm leading-relaxed text-neutral-600">
            Today, our platform powers thousands of dining visits daily, helping restaurants
            maximize their seating efficiency while giving customers the freedom to explore until
            their table is ready.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff7f0] to-[#feeddd] border border-[#ffeedd] p-8 sm:p-10 text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-white shadow-xs border border-[#fae2d3] mb-4">
            <img src={spotqLogo} alt="spotQ Logo" className="size-9 object-contain" />
          </div>
          <h3 className="text-xl font-bold text-neutral-900">Are you a restaurant owner?</h3>
          <p className="mt-2 text-xs sm:text-sm text-neutral-600 max-w-sm">
            Partner with SpotQ to optimize table turns, reduce no-shows, and provide five-star
            hospitality from day one.
          </p>
          <Link
            to="/restaurant/email/verification"
            className={cn(
              buttonVariants(),
              "mt-5 rounded-full bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold px-6 h-10",
            )}
          >
            Get Started in 5 Minutes
          </Link>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
