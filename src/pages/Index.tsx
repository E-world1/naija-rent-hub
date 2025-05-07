
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import HowItWorks from "@/components/home/HowItWorks";
import PaymentSection from "@/components/home/PaymentSection";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <FeaturedProperties />
      <HowItWorks />
      <PaymentSection />
    </Layout>
  );
};

export default Index;
