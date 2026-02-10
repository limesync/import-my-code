export default function PrivacyPage() {
  return (
    <div className="store-container py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-accent/40" />
            <span className="text-accent text-lg">◆</span>
            <div className="h-px w-12 bg-accent/40" />
          </div>
          <span className="section-label">Information</span>
          <h1 className="section-title mb-6">
            Privatlivspolitik
          </h1>
          <p className="text-muted-foreground">
            Sidst opdateret: Februar 2025
          </p>
        </div>

        <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">1. Dataansvarlig</h2>
            <p>Thumbie er dataansvarlig for behandlingen af de personoplysninger, vi indsamler om dig. Har du spørgsmål til vores behandling af dine personoplysninger, er du velkommen til at kontakte os på:</p>
            <p>Email: hej@thumbie.dk<br />Adresse: Designvej 42, 2100 København Ø</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">2. Hvilke oplysninger indsamler vi?</h2>
            <p>Vi indsamler og behandler følgende typer personoplysninger:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Identifikationsoplysninger:</strong> Navn, adresse, telefonnummer, email</li>
              <li><strong>Betalingsoplysninger:</strong> Betalingsmetode (vi gemmer ikke fulde kortoplysninger)</li>
              <li><strong>Ordreoplysninger:</strong> Købshistorik, ønskeliste, kurv</li>
              <li><strong>Tekniske oplysninger:</strong> IP-adresse, browser, enhed, cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">3. Formål med behandlingen</h2>
            <p>Vi bruger dine personoplysninger til:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>At behandle og levere dine ordrer</li>
              <li>At kommunikere med dig om dine køb</li>
              <li>At sende nyhedsbreve (kun med dit samtykke)</li>
              <li>At forbedre vores hjemmeside og service</li>
              <li>At overholde lovkrav (regnskab, garanti mv.)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">4. Retsgrundlag</h2>
            <p>Vi behandler dine personoplysninger på baggrund af:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Kontraktopfyldelse:</strong> For at levere de produkter, du har bestilt</li>
              <li><strong>Lovkrav:</strong> For at overholde bogføringsloven mv.</li>
              <li><strong>Samtykke:</strong> Til markedsføring og nyhedsbreve</li>
              <li><strong>Legitime interesser:</strong> For at forbedre vores service</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">5. Opbevaringsperiode</h2>
            <p>Vi opbevarer dine personoplysninger så længe, det er nødvendigt for de formål, de er indsamlet til. Ordreoplysninger opbevares i 5 år af hensyn til bogføringsloven. Marketingsamtykke slettes, når du trækker det tilbage.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">6. Dine rettigheder</h2>
            <p>Du har ret til at:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Få indsigt i de oplysninger, vi behandler om dig</li>
              <li>Få berigtiget urigtige oplysninger</li>
              <li>Få slettet dine oplysninger (med visse undtagelser)</li>
              <li>Gøre indsigelse mod behandlingen</li>
              <li>Få udleveret dine data i et struktureret format</li>
              <li>Klage til Datatilsynet</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">7. Deling af oplysninger</h2>
            <p>Vi deler kun dine oplysninger med betroede partnere, der hjælper os med at drive vores forretning, fx:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Betalingsudbydere (til behandling af betaling)</li>
              <li>Fragtselskaber (til levering af ordrer)</li>
              <li>Nyhedsbrevstjenester (hvis du har tilmeldt dig)</li>
            </ul>
            <p>Alle partnere er forpligtet til at beskytte dine data og må kun bruge dem til det aftalte formål.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">8. Sikkerhed</h2>
            <p>Vi tager sikkerheden af dine data alvorligt og bruger SSL-kryptering, sikre servere og adgangskontrol for at beskytte dine oplysninger.</p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">9. Kontakt</h2>
            <p>Har du spørgsmål til denne privatlivspolitik eller ønsker at udøve dine rettigheder, kan du kontakte os på hej@thumbie.dk.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
