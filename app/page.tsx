import { Wortmarke } from "@/components/site/Wortmarke";

/**
 * Platzhalter-Startseite für Phase 0 (Grundgerüst).
 * Zeigt nur die Wortmarke in Navy auf Paper. Die echte Startseite entsteht in Phase 2.
 */
export default function Home() {
  return (
    <main className="flex flex-1 items-center justify-center p-8">
      <h1 className="text-navy">
        <Wortmarke className="h-8 w-auto" />
      </h1>
    </main>
  );
}
