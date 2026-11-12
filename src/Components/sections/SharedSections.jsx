import { useLanguage } from '../../i18n/LanguageContext';
import React from 'react';
import { Ruler, SprayCan, Wrench, Check, ArrowUpRight, Layers, MoveUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { images } from '../../data/images';
import { SectionHeading, TextLink, Button } from '../ui/Primitives';
export function ServiceCards() {
  const { t } = useLanguage();
  return <section className="section">
  <div className="container">
    <SectionHeading eyebrow={t("What we do")} title={<>{t("Two specialties.")}<br />{t("One dependable partner.")}</>} action={<TextLink to="/Services">{t("Explore our services")}</TextLink>} />
    <div className="services-grid">
      <Link className="service-card" to="/Services#coating">
        <div className="service-card__image">
          <img src={images.coating} alt={t("KMC technician spray-coating a baking tray")} loading="lazy" decoding="async" width="600" height="390" />
          <span className="service-card__number">{t("01 / COATING")}</span>
        </div>
        <div className="service-card__body">
          <div className="service-card__title">
            <h3>{t("Coating & refurbishment")}</h3>
            <ArrowUpRight size={22} />
          </div>
          <p>{t("A fresh finish for hard-working trays. Refurbishment and water-based, double-layer PTFE coating.")}</p>
          <div className="service-card__tags">
            <span>{t("Tray refurbishment")}</span>
            <span>{t("Non-stick coating")}</span>
          </div>
        </div>
      </Link>
      <Link className="service-card" to="/Services#custom">
        <div className="service-card__image">
          <img src={images.trays} alt={t("Custom fabrication illustration: a stainless steel tray and measuring caliper on a workbench")} loading="lazy" decoding="async" width="600" height="390" />
          <span className="service-card__number">{t("02 / FABRICATION")}</span>
        </div>
        <div className="service-card__body">
          <div className="service-card__title">
            <h3>{t("Custom fabrication")}</h3>
            <ArrowUpRight size={22} />
          </div>
          <p>{t("Your dimensions. Your design. Stainless steel and aluminium trays made around your baking needs.")}</p>
          <div className="service-card__tags">
            <span>{t("Custom sizes & shapes")}</span>
            <span>{t("Stainless steel & aluminium")}</span>
          </div>
        </div>
      </Link>
    </div>
    <Link to="/Services#maintenance" className="maintenance-strip">
      <span className="icon-box">
        <Wrench size={21} aria-hidden="true" />
      </span>
      <div>
        <h3>{t("Keep your equipment working.")}</h3>
        <p>{t("Tray maintenance, repairs and equipment servicing.")}</p>
      </div>
      <span className="maintenance-strip__link">{t("Maintenance & repair")}<ArrowUpRight size={18} /></span>
    </Link>
  </div>
  </section>;
}
export function AboutSection() {
  const { t } = useLanguage();
  return <section className="section surface">
  <div className="container about-grid">
    <div className="about-visual">
      <div className="media">
        <img src={images.workshop} alt={t("Baking trays and fabrication equipment inside KMC's workshop")} width="700" height="650" loading="lazy" decoding="async" />
      </div>
      <div className="experience-card">
        <strong>30<span>+</span></strong>
        <p>{t("years of experience")}<br />{t("in every detail.")}</p>
      </div>
      <span className="image-caption">{t("OUR WORKSHOP / BALAKONG, MALAYSIA")}</span>
    </div>
    <div className="about-copy">
      <p className="eyebrow">{t("The people behind your trays")}</p>
      <h2>{t("Crafted with care.")}<br />{t("Built on experience.")}</h2>
      <p className="lead">{t("For over 30 years, KMC 63 Trading has worked with bakeries and food manufacturers to make trays that fit the way they work.")}</p>
      <p>{t("From custom bun pans to a new non-stick finish, we bring fabrication and coating together under one roof in Balakong, Selangor.")}</p>
      <div className="value-grid">
        {['Made to your dimensions', 'Stainless steel & aluminium', 'PTFE non-stick coating', 'Fabrication & refurbishment'].map(text => <span key={text}>
          <Check size={16} aria-hidden="true" />
          {t(text)}
        </span>)}
      </div>
      <TextLink to="/aboutUs">{t("Get to know KMC")}</TextLink>
    </div>
  </div>
  </section>;
}
export const processSteps = [['Tell us what you need', 'Share your tray dimensions, a sample or your coating requirements.'], ['Work through the details', 'Discuss materials, shapes and the right service for your needs.'], ['Make it. Or renew it.', 'Custom fabrication or refurbishment, according to your requirements.'], ['Ready for your next bake', 'Arrange delivery or collection and discuss any follow-up needs.']];
export function ProcessSection() {
  const { t } = useLanguage();
  return <section className="section">
  <div className="container">
    <SectionHeading eyebrow={t("From idea to production")} title={t("A clear path to your next tray.")} description={t("A practical conversation. A solution shaped around your work.")} />
    <div className="process-grid">
      {processSteps.map(([title, text], i) => <article className="process-step" key={title}>
        <div className="process-step__top">
          <span>0{i + 1}</span>
          <MoveUpRight size={17} aria-hidden="true" />
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
  </section>;
}
export function Gallery({
  title = 'Real work. From our workshop.'
}) {
  const { t } = useLanguage();
  return <section className="section gallery-section">
  <div className="container">
    <SectionHeading eyebrow={t("Inside KMC")} title={t(title)} description={t("A closer look at the people, processes and products behind every order.")} />
    <div className="gallery-grid">
      <figure className="gallery-main">
        <img src={images.factory} alt={t("KMC team member working among tray fabrication machines")} width="800" height="620" loading="lazy" decoding="async" />
        <figcaption>
          <span>{t("01 / THE WORKSHOP")}</span>
          <strong>{t("Where your requirements take shape.")}</strong>
        </figcaption>
      </figure>
      <figure>
        <img src={images.racks} alt={t("Round bun pans arranged on a bakery rack")} width="500" height="300" loading="lazy" decoding="async" />
        <figcaption>
          <span>{t("02 / MADE FOR BAKING")}</span>
        </figcaption>
      </figure>
      <figure>
        <img src={images.fabrication} alt={t("Stacks of fabricated baking trays next to workshop machinery")} width="500" height="300" loading="lazy" decoding="async" />
        <figcaption>
          <span>{t("03 / EVERYDAY CRAFTSMANSHIP")}</span>
        </figcaption>
      </figure>
    </div>
  </div>
  </section>;
}
export function Capabilities() {
  const { t } = useLanguage();
  return <div className="capability-strip">
  <div className="container capability-strip__grid">
    <div>
      <strong>30<span>+</span></strong>
      <span>{t("Years of experience")}</span>
    </div>
    <div>
      <Ruler size={24} strokeWidth={1.4} aria-hidden="true" />
      <span>{t("Custom dimensions")}</span>
    </div>
    <div>
      <SprayCan size={24} strokeWidth={1.4} aria-hidden="true" />
      <span>{t("PTFE non-stick coating")}</span>
    </div>
    <div>
      <Layers size={24} strokeWidth={1.4} aria-hidden="true" />
      <span>{t("Built for B2B")}</span>
    </div>
  </div>
  </div>;
}
export function ProductPreview() {
  const { t } = useLanguage();
  return <section className="section product-preview">
  <div className="container product-preview__grid">
    <div>
      <p className="eyebrow">{t("Made for your production line")}</p>
      <h2>{t("A tray for")}<br />{t("your next batch.")}</h2>
      <p className="lead">{t("Explore bun trays, steamers and bakery trolleys, or talk to us about a custom solution.")}</p>
      <Button to="/Products" variant="secondary">{t("Browse products")}</Button>
    </div>
    <Link to="/Products" className="product-preview__item">
      <img src={images.product} alt={t("JS20108 hot dog bun tray with 15 grooves")} loading="lazy" width="500" height="360" />
      <div>
        <span>{t("JS20108 / BUN TRAY")}</span>
        <ArrowUpRight size={22} />
      </div>
    </Link>
  </div>
  </section>;
}
