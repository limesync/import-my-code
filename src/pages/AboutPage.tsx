import { Heart, Leaf, Award, Users } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="store-container py-16 md:py-24">
      <div>
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-12 bg-accent/40" />
            <span className="text-accent text-lg">◆</span>
            <div className="h-px w-12 bg-accent/40" />
          </div>
          <span className="section-label">Vores historie</span>
          <h1 className="section-title mb-6">
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
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Award, title: 'Kvalitet', desc: 'Vi kompromitterer aldrig på kvaliteten. Hvert produkt er nøje udvalgt for holdbarhed og komfort.', bg: 'bg-primary/10', color: 'text-primary' },
              { icon: Leaf, title: 'Bæredygtighed', desc: 'Vi arbejder kontinuerligt på at reducere vores miljøaftryk og vælge bæredygtige materialer.', bg: 'bg-accent/10', color: 'text-accent' },
              { icon: Heart, title: 'Passion', desc: 'Vores kærlighed til design og tekstiler driver alt, hvad vi gør. Det kan du mærke i hvert produkt.', bg: 'bg-blush/20', color: 'text-blush-foreground' },
              { icon: Users, title: 'Kundefokus', desc: 'Din tilfredshed er vores højeste prioritet. Vi er altid klar til at hjælpe og vejlede.', bg: 'bg-primary/10', color: 'text-primary' },
            ].map(({ icon: Icon, title, desc, bg, color }, i) => (
              <div key={i} className="flex gap-4 p-6 bg-card border border-border rounded-2xl transition-all duration-300 hover:shadow-md" style={{ boxShadow: 'var(--shadow-card)' }}>
                <div className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon className={color} size={24} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-medium mb-2">{title}</h3>
                  <p className="text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-secondary/30 rounded-2xl p-8 md:p-12 text-center" style={{ boxShadow: 'var(--shadow-card)' }}>
          <span className="text-accent text-xl mb-4 block">◆</span>
          <h2 className="font-display text-2xl font-semibold mb-4">
            Har du spørgsmål?
          </h2>
          <p className="text-muted-foreground mb-6">
            Vi er altid klar til at hjælpe. Kontakt os, og vi vender tilbage hurtigst muligt.
          </p>
          <a href="/kontakt" className="btn-primary inline-block">
            Kontakt os
          </a>
        </div>
      </div>
    </div>
  );
}
