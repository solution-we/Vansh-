import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, Phone, MessageCircle } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';

const helpItems = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'vansheofficial@gamil.com',
    action: 'mailto:vansheofficial@gamil.com',
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: '+33 6 44 62 68 90',
    action: 'tel:+33644626890',
  },
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    description: 'Chat with us',
    action: 'https://wa.me/33644626890',
  },
];

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background pb-bottom-nav">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container flex items-center justify-between h-nav">
          <Link to="/account" className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <span className="font-serif text-lg font-medium">Help & Support</span>
          <div className="w-9" />
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-nav px-4 py-8">
        <div className="mb-8">
          <h2 className="font-serif text-xl mb-2">How can we help?</h2>
          <p className="text-sm text-muted-foreground">
            Get in touch with our support team
          </p>
        </div>

        <div className="space-y-4">
          {helpItems.map(({ icon: Icon, title, description, action }) => (
            <a
              key={title}
              href={action}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                <Icon className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 p-4 bg-secondary rounded-lg">
          <h3 className="font-medium mb-2">FAQs</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="hover:text-foreground cursor-pointer">• How do I track my order?</li>
            <li className="hover:text-foreground cursor-pointer">• What is the return policy?</li>
            <li className="hover:text-foreground cursor-pointer">• How do I change my size?</li>
            <li className="hover:text-foreground cursor-pointer">• Payment issues</li>
          </ul>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
