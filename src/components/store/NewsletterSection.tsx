import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      toast.success('Tak for din tilmelding!');
      setEmail('');
    }
  };

  return (
    <section className="bg-primary/10 border-y border-primary/15">
      <div className="store-container py-16 md:py-20">
        <div className="max-w-xl mx-auto text-center">
          <span className="text-primary text-2xl mb-4 block">✿</span>
          <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground mb-3">
            Bliv en del af eventyret
          </h2>
          <p className="text-muted-foreground text-sm mb-8">
            Tilmeld dig vores nyhedsbrev og få 10% rabat på din første ordre, 
            plus eksklusive tilbud og inspiration.
          </p>

          {isSubscribed ? (
            <div className="flex items-center justify-center gap-2 text-primary">
              <CheckCircle size={20} />
              <span className="font-medium">Du er nu tilmeldt!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Din email adresse"
                className="flex-1 px-5 py-3.5 bg-background border border-border rounded-full text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                required
              />
              <button
                type="submit"
                className="btn-primary flex items-center justify-center gap-2"
              >
                Tilmeld
                <Send size={16} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}