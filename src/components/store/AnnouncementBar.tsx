import { Truck } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="announcement-bar">
      <div className="store-container flex items-center justify-center gap-2">
        <span className="text-primary/70">✿</span>
        <Truck size={14} className="opacity-70" />
        <span>Gratis fragt ved køb over 500 kr · 30 dages returret</span>
        <span className="text-primary/70">✿</span>
      </div>
    </div>
  );
}