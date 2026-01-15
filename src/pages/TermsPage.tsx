import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { BottomNav } from '@/components/layout/BottomNav';
import vansheLogo from '@/assets/vanshe-logo.png';

export default function TermsPage() {
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

        <h1 className="font-serif text-3xl md:text-4xl mb-2">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-8">Last updated: January 2026</p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground">
          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">1. Agreement to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using VANSHÉ ("we", "our", or "the Service"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">2. Eligibility</h2>
            <p className="text-muted-foreground leading-relaxed">
              You must be at least 18 years old to create an account and make purchases. By using our Service, 
              you represent that you meet this age requirement.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">3. Account Responsibilities</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials. 
              You agree to provide accurate, current, and complete information during registration and keep it updated.
              You are responsible for all activities that occur under your account.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">4. Products and Purchases</h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>All product images are for illustration purposes. Actual products may vary slightly in color or appearance.</li>
              <li>Prices are displayed in Indian Rupees (₹) and may change without notice.</li>
              <li>We reserve the right to limit quantities or refuse orders at our discretion.</li>
              <li>Payment must be completed at the time of purchase through our approved payment partners.</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">5. Shipping and Delivery</h2>
            <p className="text-muted-foreground leading-relaxed">
              Estimated delivery times are approximate and not guaranteed. 
              We are not responsible for delays caused by shipping carriers, customs, or circumstances beyond our control.
              Risk of loss transfers to you upon delivery to the carrier.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">6. Returns and Refunds</h2>
            <p className="text-muted-foreground leading-relaxed">
              Returns are accepted within 7 days of delivery for unused items in original packaging.
              Refunds will be processed within 5-7 business days after we receive and inspect the returned item.
              Original shipping costs are non-refundable. Contact our support team to initiate a return.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">7. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              All content on VANSHÉ, including but not limited to text, graphics, logos, images, and software, 
              is the property of VANSHÉ and protected by intellectual property laws. 
              You may not reproduce, distribute, or create derivative works without our written permission.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">8. Prohibited Conduct</h2>
            <p className="text-muted-foreground leading-relaxed mb-2">You agree not to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2">
              <li>Use the Service for any unlawful purpose</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper functioning of the Service</li>
              <li>Submit false or misleading information</li>
              <li>Resell products purchased from VANSHÉ without authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by law, VANSHÉ shall not be liable for any indirect, incidental, 
              special, consequential, or punitive damages arising from your use of the Service.
              Our total liability shall not exceed the amount you paid for the product in question.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">10. Changes to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update these Terms of Service from time to time. 
              We will notify you of significant changes via email or through the Service.
              Your continued use after such changes constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-xl font-medium mt-8 mb-4">11. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have any questions about these Terms of Service, please contact us at{' '}
              <a href="mailto:support@vanshe.com" className="text-primary underline underline-offset-4">
                support@vanshe.com
              </a>
            </p>
          </section>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
