import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AnimalDetails } from "@/components/animals/AnimalDetails";
import { BookingForm } from "@/components/booking/BookingForm";
import { getAnimalById } from "@/lib/animals";
import { getServerSession } from "@/lib/session";
import type { SessionBundle } from "@/types";

interface DetailsPageProps {
  params: Promise<{ id: string }>;
}

/** Static metadata for every listing (SEO for /details-page/[id]). */
export async function generateMetadata({ params }: DetailsPageProps): Promise<Metadata> {
  const { id } = await params;
  const animal = getAnimalById(id);

  if (!animal) {
    return {
      title: "Animal Not Found",
      description: "This livestock listing could not be found on QurbaniHat.",
      robots: { index: false, follow: false },
    };
  }

  const description = `${animal.name} — ${animal.breed} ${animal.type.toLowerCase()}, ${animal.weight} kg, ${animal.age} years old in ${animal.location}. ${animal.description}`;

  return {
    title: `${animal.name} — ${animal.breed}`,
    description,
    alternates: { canonical: `/details-page/${animal.id}` },
    openGraph: {
      title: `${animal.name} — ${animal.breed} | QurbaniHat`,
      description,
      images: [{ url: animal.image, alt: animal.name }],
    },
  };
}

export default async function AnimalDetailsPage({ params }: DetailsPageProps) {
  const { id } = await params;
  const animal = getAnimalById(id);

  // Invalid id (unknown, non-numeric, path traversal attempts) -> custom 404.
  if (!animal) notFound();

  // proxy.ts already redirects signed-out visitors; this is the real check so
  // the page renders correctly even if the proxy is bypassed.
  const session = (await getServerSession()) as SessionBundle | null;

  return (
    <section className="section">
      <div className="container-page space-y-14">
        <AnimalDetails animal={animal} />
        <BookingForm
          animal={animal}
          defaultName={session?.user?.name ?? ""}
          defaultEmail={session?.user?.email ?? ""}
        />
      </div>
    </section>
  );
}