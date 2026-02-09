import HeroSection from '@/components/store/HeroSection';
import FeaturedProducts from '@/components/store/FeaturedProducts';
import USPBanner from '@/components/store/USPBanner';
import StorySection from '@/components/store/StorySection';
import NewsletterSection from '@/components/store/NewsletterSection';

export default function StorefrontHome() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <USPBanner />
      <StorySection />
      <NewsletterSection />
    </>
  );
}