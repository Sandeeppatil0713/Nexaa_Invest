import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Hero } from "@/components/landing/hero";
import { Stats, Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Plans } from "@/components/landing/plans";
import { DashboardPreview } from "@/components/landing/dashboard-preview";
import { ReferralSystem } from "@/components/landing/referral-system";
import { BusinessLogic } from "@/components/landing/business-logic";
import { TechStack, Security } from "@/components/landing/tech-security";
import { ApiShowcase, DatabaseArchitecture } from "@/components/landing/api-database";
import { Testimonials, FAQ } from "@/components/landing/testimonials-faq";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NexaInvest — Invest Smarter. Earn Daily. Grow Together." },
      {
        name: "description",
        content:
          "Invest in curated plans, earn automated daily ROI, build a 4-level referral network and track everything from a premium analytics dashboard.",
      },
      { property: "og:title", content: "NexaInvest — Invest Smarter. Earn Daily." },
      {
        property: "og:description",
        content:
          "Automated daily ROI, multi-level referral income and real-time portfolio analytics.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Plans />
        <DashboardPreview />
        <ReferralSystem />
        <BusinessLogic />
        <TechStack />
        <Security />
        <ApiShowcase />
        <DatabaseArchitecture />
        <Testimonials />
        <FAQ />
      </main>
      <Footer />
    </div>
  );
}
