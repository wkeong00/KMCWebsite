import { useLanguage } from '../i18n/LanguageContext';
import React from 'react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { images } from '../data/images';
import { Button } from '../Components/ui/Primitives';
import { Capabilities, ServiceCards, AboutSection, ProcessSection, Gallery, ProductPreview } from '../Components/sections/SharedSections';
export default function HomePage() {
  const { t } = useLanguage();
  return <>
  <section className="hero">
    <div className="container hero__grid">
      <div className="hero__copy">
        <p className="eyebrow">{t("Stainless steel fabrication & coating")}</p>
        <h1>{t("Baking trays")}<br />{t("built precise.")}<br /><span>{t("Coatings built")}<br />{' '}{t("to last.")}</span></h1>
        <p className="lead">{t("Custom baking trays and PTFE coating services for bakeries, food factories and distributors.")}</p>
        <div className="actions">
          <Button to="#contact">{t("Request a Quote")}</Button>
          <Button to="/Services" variant="secondary">{t("Explore Services")}</Button>
        </div>
        <div className="hero__footnote"><span className="status-dot" />{t("BASED IN SELANGOR. BUILT AROUND YOU.")}</div>
      </div>
      <div className="hero__visual">
        <div className="hero__photo">
          <img src={images.factory} alt={t("Baking tray fabrication at the KMC workshop in Balakong")} width="700" height="800" fetchpriority="high" decoding="async" />
          <span className="hero__photo-tag">{t("THE KMC WORKSHOP")}<ArrowUpRight size={15} /></span>
        </div>
        <div className="hero__detail">
          <span className="hero__detail-icon">
            <ArrowDownRight size={26} strokeWidth={1.3} />
          </span>
          <div>
            <strong>{t("Made to your specifications.")}</strong>
            <span>{t("From the first dimension to the final finish.")}</span>
          </div>
          <span className="hero__detail-label">KMC / 01</span>
        </div>
        <span className="hero__vertical">{t("PRECISION IN EVERY DETAIL")}</span>
      </div>
    </div>
  </section>
  <Capabilities />
  <ServiceCards />
  <AboutSection />
  <ProcessSection />
  <ProductPreview />
  <Gallery />
  </>;
}
