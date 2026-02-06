"use client";

import Link from "next/link";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useTranslation } from "@/lib/i18n/context";

type FeaturedEvent = {
  id: string;
  title: string;
  description: string;
  location: string;
  image: string | null;
};

function truncate(str: string, max: number) {
  if (str.length <= max) return str;
  return str.slice(0, max).trim() + "…";
}

export function FeaturedHero({
  event,
  isFavorite,
}: {
  event: FeaturedEvent | null;
  isFavorite: boolean;
}) {
  const { t } = useTranslation();
  if (!event) return null;

  return (
    <section className="relative rounded-2xl overflow-hidden mb-8 md:mb-10">
      <div className="relative min-h-[280px] md:min-h-[340px] flex flex-col justify-end p-6 md:p-10">
        {event.image ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              aria-hidden
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30" aria-hidden />
          </>
        ) : (
          <div className="absolute inset-0 bg-underground-card" aria-hidden />
        )}

        <div className="relative z-10">
          <span className="inline-block bg-underground-accent text-white text-xs font-semibold px-3 py-1 rounded mb-3 uppercase tracking-wide">
            {t("hero.featuredTonight")}
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight mb-2">
            {event.title}
          </h2>
          <p className="text-white/90 text-sm md:text-base max-w-2xl mb-4">
            {truncate(event.description, 120)}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/events/${event.id}`}
              className="inline-flex items-center bg-underground-accent text-white font-medium px-5 py-2.5 rounded-lg hover:opacity-90 transition"
            >
              {t("hero.getTickets")}
            </Link>
            <FavoriteButton eventId={event.id} initialChecked={isFavorite} variant="icon" />
          </div>
        </div>
      </div>
    </section>
  );
}
