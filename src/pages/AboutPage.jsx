import { useLanguage } from '../i18n/LanguageContext';
import React from 'react';
import { Ruler, Layers, Handshake } from 'lucide-react';
import { PageHero } from '../Components/layout/SiteLayout';
import { SectionHeading } from '../Components/ui/Primitives';
import { Capabilities, Gallery } from '../Components/sections/SharedSections';
import { images } from '../data/images';
export default function AboutPage() {
  const { t } = useLanguage();
  return <>
  <PageHero label={t("About")} title={<>{t("Experience in the craft.")}<br />{t("Care in every tray.")}</>} description={t("A Malaysian fabrication and coating partner for bakeries and food manufacturers, with over 30 years of experience.")} image={images.exterior} alt={t("The KMC 63 Trading workshop exterior in Balakong")} />
  <section className="section">
    <div className="container story-grid">
      <div>
        <p className="eyebrow">{t("Our story")}</p>
        <h2>{t("Practical expertise.")}<br />{t("Personal attention.")}</h2>
      </div>
      <div className="story-copy">
        <p className="lead">{t("We make baking trays around the needs of the people who use them.")}</p>
        <p>{t("Based in Balakong, Selangor, KMC 63 Trading brings together custom stainless steel fabrication and professional coating services. Our work includes bun trays, baking pans and custom shapes for bakeries, food factories and distributors.")}</p>
        <p>{t("Some projects start with a drawing. Others start with a well-used tray that needs a fresh finish. We work through the dimensions, materials and coating requirements with you to find a practical solution.")}</p>
        <p>{t("Our focus is straightforward: careful craftsmanship, reliable products and a working relationship built on understanding your needs.")}</p>
      </div>
    </div>
  </section>
  <Capabilities />
  <section className="section">
    <div className="container">
      <SectionHeading eyebrow={t("What we care about")} title={t("The details make the difference.")} />
      <div className="values-grid">
        {[[Ruler, '01', 'Precision', 'Dimensions, shapes and tray profiles tailored to the way you bake.'], [Layers, '02', 'Durability', 'Materials and non-stick finishes selected for your baking requirements.'], [Handshake, '03', 'Partnership', 'A direct conversation, from your initial enquiry to your next order.']].map(([Icon, n, title, text]) => <article className="value-card" key={title}>
          <div>
            <Icon size={28} strokeWidth={1.4} aria-hidden="true" />
            <span>
              {n}
            </span>
          </div>
          <h3>
            {t(title)}
          </h3>
          <p>
            {t(text)}
          </p>
        </article>)}
      </div>
    </div>
  </section>
  <Gallery title={t("Step inside our workshop.")} />
  </>;
}
