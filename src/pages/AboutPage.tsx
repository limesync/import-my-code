import { Heart, Leaf, Award, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="store-container py-16 md:py-24">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-6">
            Om Thumbie
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Vi skaber stilfulde pudebetræk til pyntepuder, der forvandler dit hjem til et 
            behageligt og elegant rum. Vores passion er kvalitet og skandinavisk design.
          </p>
        </div>

        {/* Story */}
        <div className="mb-20">
          <h2 className="font-display text-2xl font-semibold mb-6">Vores Historie</h2>
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p>
              Thumbie blev grundlagt med en simpel vision: at bringe skandinavisk 
              design og kvalitet ind i hvert hjem gennem smukke, håndudvalgte pudebetræk til pyntepuder.
            </p>
            <p>
              Vi tror på, at de små detaljer gør en stor forskel. Et veldesignet 
              pudebetræk kan transformere et rum og skabe en følelse af hygge og 
              velvære. Derfor udvælger vi omhyggeligt hvert eneste produkt i vores 
              kollektion.
            </p>
            <p>
              Vores rejse startede med en kærlighed til tekstiler og en ambition 
              om at skabe kvalitetspudebetræk til rimelige priser. I dag er vi 
              stolte af at tilbyde en kurateret kollektion, der kombinerer 
              æstetik, kvalitet og bæredygtighed — og vi udvider løbende med nye produktkategorier.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <h2 className="font-display text-2xl font-semibold mb-8">Vores Værdier</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Award className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-display text-lg font-medium mb-2">Kvalitet</h3>
                <p className="text-muted-foreground">
                  Vi kompromitterer aldrig på kvaliteten. Hvert produkt er nøje 
                  udvalgt for holdbarhed og komfort.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Leaf className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-display text-lg font-medium mb-2">Bæredygtighed</h3>
                <p className="text-muted-foreground">
                  Vi arbejder kontinuerligt på at reducere vores miljøaftryk 
                  og vælge bæredygtige materialer.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Heart className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-display text-lg font-medium mb-2">Passion</h3>
                <p className="text-muted-foreground">
                  Vores kærlighed til design og tekstiler driver alt, hvad vi gør. 
                  Det kan du mærke i hvert produkt.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="text-primary" size={24} />
              </div>
              <div>
                <h3 className="font-display text-lg font-medium mb-2">Kundefokus</h3>
                <p className="text-muted-foreground">
                  Din tilfredshed er vores højeste prioritet. Vi er altid klar 
                  til at hjælpe og vejlede.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="bg-secondary/30 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="font-display text-2xl font-semibold mb-4">
            Har du spørgsmål?
          </h2>
          <p className="text-muted-foreground mb-6">
            Vi er altid klar til at hjælpe. Kontakt os, og vi vender tilbage hurtigst muligt.
          </p>
          <a
            href="/kontakt"
            className="btn-primary inline-block"
          >
            Kontakt os
          </a>
        </div>
      </div>
    </div>
  );
}
