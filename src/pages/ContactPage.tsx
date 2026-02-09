import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Tak for din besked! Vi vender tilbage hurtigst muligt.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="store-container py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-6">
            Kontakt os
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Har du spørgsmål eller brug for hjælp? Vi er her for at hjælpe dig.
            Send os en besked, og vi vender tilbage hurtigst muligt.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-display text-xl font-semibold mb-6">
                Kontaktinformation
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:hej@thumbie.dk" className="text-muted-foreground hover:text-primary transition-colors">
                      hej@thumbie.dk
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Telefon</p>
                    <a href="tel:+4512345678" className="text-muted-foreground hover:text-primary transition-colors">
                      +45 12 34 56 78
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Adresse</p>
                    <p className="text-muted-foreground">
                      Designvej 42<br />
                      2100 København Ø<br />
                      Danmark
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="text-primary" size={18} />
                  </div>
                  <div>
                    <p className="font-medium">Åbningstider</p>
                    <p className="text-muted-foreground">
                      Man - Fre: 09:00 - 17:00<br />
                      Weekend: Lukket
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-secondary/30 rounded-xl p-6">
              <h3 className="font-display text-lg font-medium mb-2">
                Hurtig support
              </h3>
              <p className="text-sm text-muted-foreground">
                Vi bestræber os på at besvare alle henvendelser inden for 24 timer 
                på hverdage.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-card border rounded-2xl p-8">
              <h2 className="font-display text-xl font-semibold mb-6">
                Send os en besked
              </h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Navn</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Dit navn"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="din@email.dk"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Emne</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Hvad handler din henvendelse om?"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Besked</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Skriv din besked her..."
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
                  <Send size={16} />
                  {isSubmitting ? 'Sender...' : 'Send besked'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
