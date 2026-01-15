import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import vansheLogo from '@/assets/vanshe-logo.png';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background pb-bottom-nav">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="container flex items-center justify-center h-nav">
          <Link to="/" className="flex items-center gap-2 font-serif text-2xl md:text-3xl font-medium tracking-tight">
            <img src={vansheLogo} alt="Vanshé logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" loading="lazy" decoding="async" />
            VANSHÉ
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="pt-nav px-4 py-8 max-w-3xl mx-auto">
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <h1 className="font-serif text-3xl md:text-4xl mb-2">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: January 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              At VANSHÉ, we respect your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains what information we collect, how we use it, and your rights regarding your data.
              We believe in transparency and collect only the data necessary to provide you with our services.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">Information We Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We collect only the information necessary to provide our services:
            </p>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <h3 className="font-medium text-sm mb-1">Account Information</h3>
                <p className="text-muted-foreground text-sm">Email address, full name, username, and phone number for account creation and communication.</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h3 className="font-medium text-sm mb-1">Shipping Information</h3>
                <p className="text-muted-foreground text-sm">Delivery address and contact details to fulfill your orders.</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <h3 className="font-medium text-sm mb-1">Order History</h3>
                <p className="text-muted-foreground text-sm">Records of your purchases for order tracking and customer support.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">What We Do NOT Collect</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>We do not use tracking cookies for advertising purposes</li>
              <li>We do not collect payment card details (handled securely by our payment partners)</li>
              <li>We do not collect biometric data</li>
              <li>We do not track your browsing activity on other websites</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Order Processing:</strong> To process and deliver your orders</li>
              <li><strong>Customer Support:</strong> To respond to your inquiries and resolve issues</li>
              <li><strong>Account Management:</strong> To maintain and secure your account</li>
              <li><strong>Service Improvements:</strong> To understand how our services are used and improve them</li>
              <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">Data Sharing</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We do not sell, rent, or trade your personal information. We only share your data with:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Shipping Partners:</strong> To deliver your orders (name, address, phone)</li>
              <li><strong>Payment Processors:</strong> To process transactions securely</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">Data Security</h2>
            <p className="text-muted-foreground leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal data against 
              unauthorized access, alteration, disclosure, or destruction. This includes encryption of data in transit 
              and at rest, regular security assessments, and access controls.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal data only for as long as necessary to provide our services or as required by law.
              Account data is retained while your account is active. Order data is retained for 7 years for legal and tax purposes.
              You can request deletion of your account and associated data at any time.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal data</li>
              <li><strong>Correction:</strong> Request correction of inaccurate data</li>
              <li><strong>Deletion:</strong> Request deletion of your data (subject to legal requirements)</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Objection:</strong> Object to certain processing of your data</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              Our services are not intended for individuals under 18 years of age. 
              We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. 
              We will notify you of any material changes by email or through a notice on our Service.
              The "Last updated" date at the top indicates when this policy was last revised.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us at{' '}
              <a href="mailto:privacy@vanshe.com" className="text-primary underline underline-offset-4">
                privacy@vanshe.com
              </a>
            </p>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
