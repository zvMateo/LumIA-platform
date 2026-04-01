import { Hero } from '@/features/landing/components/Hero';
import { TrustBar } from '@/features/landing/components/TrustBar';
import { HowItWorks } from '@/features/landing/components/HowItWorks';
import { ChatSection } from '@/features/landing/components/ChatSection';
import { ReportPreview } from '@/features/landing/components/ReportPreview';
import { Testimonials } from '@/features/landing/components/Testimonials';
import { Pricing } from '@/features/landing/components/Pricing';
import { FAQ } from '@/features/landing/components/FAQ';
import { StickyTestCTA } from '@/features/landing/components/StickyTestCTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <StickyTestCTA />
      <TrustBar />
      <HowItWorks />
      <ChatSection />
      <ReportPreview />
      <Testimonials />
      <Pricing />
      <FAQ />
    </>
  );
}
