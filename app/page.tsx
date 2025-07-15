import HeroSection from "@/components/hero-section"
import ProductShowcase from "@/components/product-showcase"
import ServiceSection from "@/components/service-section"
import CategoriesSection from "@/components/categories-section"
import LocationsSection from "@/components/locations-section"
import HealthTipsSection from "@/components/health-tips-section"
import OffersSection from "@/components/offers-section"
import WellnessSection from "@/components/wellness-section"

export default function Home() {
  return (
    <>
      <HeroSection />
      <ProductShowcase />
      <ServiceSection />
      <CategoriesSection />
      <WellnessSection />
      <OffersSection />
      <HealthTipsSection />
      <LocationsSection />
    </>
  )
}