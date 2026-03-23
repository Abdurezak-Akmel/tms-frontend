import { Surface } from '../../components/layout/Surface';
import {
  CredibilitySection,
  FaqSection,
  FeaturedCoursesSection,
  FinalCtaSection,
  HowItWorksSection,
  LandingFooter,
  LandingHeader,
  LandingHero,
  PricingSection,
  ProjectShowcaseSection,
  TechStackSection,
  TestimonialsSection,
  WhyChooseUsSection,
} from '../../components/landing';

const LandingPage = () => {
  return (
    <Surface variant="brand" className="flex min-h-dvh flex-col">
      <LandingHeader />
      <main className="flex-1">
        <LandingHero />
        <TechStackSection />
        <FeaturedCoursesSection />
        <WhyChooseUsSection />
        <HowItWorksSection />
        <ProjectShowcaseSection />
        <TestimonialsSection />
        <CredibilitySection />
        <PricingSection />
        <FaqSection />
        <FinalCtaSection />
      </main>
      <LandingFooter />
    </Surface>
  );
};

export default LandingPage;
