export default function TermsPage() {
  return (
    <div className="store-container py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl font-semibold mb-6">
          Handelsbetingelser
        </h1>
        <p className="text-muted-foreground mb-12">
          Sidst opdateret: Februar 2025
        </p>

        <div className="prose prose-lg max-w-none text-muted-foreground space-y-8">
          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
              1. Generelt
            </h2>
            <p>
              Disse handelsbetingelser gælder for alle køb foretaget på thumbie.dk. 
              Ved at handle hos os accepterer du disse betingelser.
            </p>
            <p>
              Thumbie<br />
              CVR: 12345678<br />
              Designvej 42, 2100 København Ø<br />
              Email: hej@thumbie.dk
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
              2. Priser
            </h2>
            <p>
              Alle priser på hjemmesiden er angivet i danske kroner (DKK) inklusive 
              moms. Fragtomkostninger tillægges ved checkout og vises tydeligt inden 
              ordren gennemføres.
            </p>
            <p>
              Vi forbeholder os ret til at ændre priser uden varsel. Den pris, der 
              gælder på bestillingstidspunktet, er dog altid den, du betaler.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
              3. Bestilling
            </h2>
            <p>
              Når du afgiver en ordre, modtager du en automatisk ordrebekræftelse på 
              email. Ordrebekræftelsen betyder, at vi har modtaget din ordre – ikke 
              at aftalen er indgået.
            </p>
            <p>
              Aftalen er først bindende, når vi har bekræftet ordren og afsendt varerne. 
              Vi forbeholder os ret til at afvise ordrer ved fejl, manglende lager 
              eller mistanke om misbrug.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
              4. Betaling
            </h2>
            <p>
              Vi accepterer følgende betalingsmetoder:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Dankort</li>
              <li>Visa / Mastercard</li>
              <li>MobilePay</li>
              <li>Bankoverførsel</li>
            </ul>
            <p>
              Beløbet hæves først, når ordren afsendes. Alle transaktioner er 
              sikret med SSL-kryptering.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
              5. Levering
            </h2>
            <p>
              Vi leverer til hele Danmark. Leveringstiden er typisk 2-4 hverdage. 
              Se vores <a href="/levering" className="text-primary hover:underline">leveringsside</a> for 
              detaljerede oplysninger om fragt og leveringstider.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
              6. Fortrydelsesret
            </h2>
            <p>
              Du har 30 dages fortrydelsesret fra den dag, du modtager din vare. 
              Varen skal returneres i ubrugt stand og i original emballage.
            </p>
            <p>
              For at udøve fortrydelsesretten skal du kontakte os på hej@thumbie.dk 
              med dit ordrenummer. Se vores <a href="/returret" className="text-primary hover:underline">returside</a> for 
              mere information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
              7. Reklamationsret
            </h2>
            <p>
              Du har 2 års reklamationsret i henhold til købeloven. Reklamationsretten 
              dækker fejl og mangler, som var til stede ved leveringen.
            </p>
            <p>
              Ved reklamation bedes du kontakte os med billeder af fejlen og dit 
              ordrenummer. Vi dækker fragten ved berettigede reklamationer.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
              8. Persondata
            </h2>
            <p>
              Vi behandler dine personoplysninger i overensstemmelse med gældende 
              lovgivning. Se vores <a href="/privatlivspolitik" className="text-primary hover:underline">privatlivspolitik</a> for 
              mere information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
              9. Klageadgang
            </h2>
            <p>
              Hvis du ønsker at klage over et køb, kan du kontakte os direkte på 
              hej@thumbie.dk. Du kan også indgive en klage til:
            </p>
            <p>
              Center for Klageløsning<br />
              Nævnenes Hus<br />
              Toldboden 2<br />
              8800 Viborg<br />
              <a href="https://naevneneshus.dk" className="text-primary hover:underline">naevneneshus.dk</a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl font-semibold text-foreground mb-4">
              10. Lovvalg og værneting
            </h2>
            <p>
              Køb på thumbie.dk er underlagt dansk ret. Eventuelle tvister afgøres 
              ved de danske domstole.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
