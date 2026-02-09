import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Link } from 'react-router-dom';

const faqData = [
  {
    category: 'Bestilling & Betaling',
    questions: [
      {
        q: 'Hvilke betalingsmetoder accepterer I?',
        a: 'Vi accepterer de mest almindelige betalingsmetoder, herunder Dankort, Visa, Mastercard, MobilePay og bankoverførsel. Alle transaktioner er sikret med SSL-kryptering.',
      },
      {
        q: 'Kan jeg ændre eller annullere min ordre?',
        a: 'Ja, du kan ændre eller annullere din ordre inden for 1 time efter bestilling. Kontakt os hurtigst muligt på hej@thumbie.dk, og vi hjælper dig.',
      },
      {
        q: 'Modtager jeg en ordrebekræftelse?',
        a: 'Ja, du modtager automatisk en ordrebekræftelse på email umiddelbart efter din bestilling. Tjek din spam-mappe, hvis du ikke kan finde den.',
      },
    ],
  },
  {
    category: 'Levering',
    questions: [
      {
        q: 'Hvor lang er leveringstiden?',
        a: 'Varer på lager afsendes inden for 1-2 hverdage. Leveringstiden er typisk 2-4 hverdage efter afsendelse afhængigt af din adresse.',
      },
      {
        q: 'Hvad koster fragt?',
        a: 'Fragt koster 39 kr. for alle ordrer under 499 kr. Ved køb over 499 kr. er fragten gratis. Vi leverer til hele Danmark.',
      },
      {
        q: 'Kan jeg spore min pakke?',
        a: 'Ja, du modtager en email med trackingnummer, så snart din ordre er afsendt. Du kan følge pakken via fragtselskabets hjemmeside.',
      },
      {
        q: 'Leverer I til udlandet?',
        a: 'I øjeblikket leverer vi kun til Danmark. Vi arbejder på at udvide vores leveringsområde i fremtiden.',
      },
    ],
  },
  {
    category: 'Returret & Reklamation',
    questions: [
      {
        q: 'Hvor lang er returfristen?',
        a: 'Du har 30 dages fuld returret fra du modtager varen. Varen skal returneres i ubrugt stand og i original emballage.',
      },
      {
        q: 'Hvordan returnerer jeg en vare?',
        a: 'Kontakt os på hej@thumbie.dk med dit ordrenummer, og vi sender dig en returlabel. Pak varen forsvarligt og aflever den hos nærmeste pakkeshop.',
      },
      {
        q: 'Hvornår får jeg mine penge tilbage?',
        a: 'Du får pengene tilbage inden for 14 dage efter vi har modtaget og godkendt din returnering. Beløbet tilbageføres til den betalingsmetode, du brugte ved købet.',
      },
      {
        q: 'Hvad gør jeg, hvis varen er beskadiget?',
        a: 'Kontakt os hurtigst muligt med billeder af skaden, og vi finder en løsning. Vi dækker selvfølgelig fragtomkostninger ved defekte varer.',
      },
    ],
  },
  {
    category: 'Produkter',
    questions: [
      {
        q: 'Hvilket materiale er pudebetrækene lavet af?',
        a: 'Vores pudebetræk er primært lavet af høj kvalitets bomuld, hør og velour. Se produktbeskrivelsen for specifikke materialer.',
      },
      {
        q: 'Hvilke størrelser findes pudebetrækene i?',
        a: 'Vi tilbyder typisk størrelserne 45x45 cm og 50x50 cm, som passer til de mest almindelige pyntepuder. Se produktsiden for tilgængelige størrelser.',
      },
      {
        q: 'Hvordan vasker jeg pudebetrækene?',
        a: 'De fleste af vores pudebetræk kan maskinvaskes ved 40°C. Tjek altid vaskeanvisningen på det enkelte produkt for at sikre lang holdbarhed.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="store-container py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-6">
            Ofte stillede spørgsmål
          </h1>
          <p className="text-lg text-muted-foreground">
            Find svar på de mest almindelige spørgsmål om bestilling, levering og vores produkter.
          </p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-10">
          {faqData.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h2 className="font-display text-xl font-semibold mb-4">
                {section.category}
              </h2>
              <Accordion type="single" collapsible className="bg-card border rounded-xl overflow-hidden">
                {section.questions.map((item, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`${sectionIndex}-${index}`}
                    className="border-b last:border-b-0"
                  >
                    <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/50 text-left">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-4 text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-secondary/30 rounded-2xl p-8 text-center">
          <h2 className="font-display text-xl font-semibold mb-3">
            Fandt du ikke svar på dit spørgsmål?
          </h2>
          <p className="text-muted-foreground mb-6">
            Vores kundeservice er klar til at hjælpe dig.
          </p>
          <Link to="/kontakt" className="btn-primary inline-block">
            Kontakt os
          </Link>
        </div>
      </div>
    </div>
  );
}
