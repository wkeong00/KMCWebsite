import { useLanguage } from '../i18n/LanguageContext';
import React from 'react';
import { Check, ArrowRight, ShieldCheck, Thermometer, Layers, Droplets } from 'lucide-react';
import { PageHero, useQuote } from '../Components/layout/SiteLayout';
import { Button } from '../Components/ui/Primitives';
import { serviceCopy } from '../data/services';
import { images } from '../data/images';
export default function ServicesPage() {
  const { t, language } = useLanguage();
  const copy = serviceCopy[language];
  const {
    requestQuote
  } = useQuote();
  return <>
  <PageHero label={t("Services")} title={<>{t("Made for your needs.")}<br />{t("Finished for your work.")}</>} description={t("Two core specialties, one workshop. Custom trays and PTFE coating services, supported by maintenance and repair.")} image={images.coating} alt={t("A KMC technician applying a coating to a baking tray")} />
  <div className="service-toolbar">
    <div className="container service-toolbar__inner">
      <nav aria-label={t("Service sections")}>
        {['coating', 'custom', 'maintenance'].map((id, i) => <a href={`#${id}`} key={id}>
          {copy.nav[i]}
        </a>)}
      </nav>

    </div>
  </div>
  <div id="service-content" lang={language === 'zh' ? 'zh-Hans' : 'en'} className={`service-content ${language === 'zh' ? 'service-content--zh' : ''}`}>
    <section id="coating" className="section service-detail">
      <div className="container">
        <div className="service-detail__grid">
          <div>
            <p className="eyebrow">
              {copy.coating.eyebrow}
            </p>
            <h2>
              {copy.coating.title}
            </h2>
            <p className="lead">
              {copy.coating.description}
            </p>
            <ul className="check-list">
              {copy.coating.features.map(text => <li key={text}>
                <Check size={17} aria-hidden="true" />
                {t(text)}
              </li>)}
            </ul>
            <Button onClick={() => requestQuote('coating and refurbishment', 'Coating')}>
              {copy.quote}
            </Button>
          </div>
          <div className="coating-examples">
            {[[images.oldTray, copy.coating.photos[0]], [images.coatedTray, copy.coating.photos[1]]].map(([image, caption]) => <figure key={image}>
              <div className="media media--product">
                <img src={image} alt={caption} loading="lazy" width="500" height="320" />
              </div>
              <figcaption>
                {caption}
              </figcaption>
            </figure>)}
          </div>
        </div>
        <div className="coating-benefits">
          <h3>
            {copy.coating.benefitsTitle}
          </h3>
          <div>
            {copy.coating.benefits.map((text, i) => {
                const Icon = [ShieldCheck, Thermometer, Layers, Droplets][i];
                return <span key={text}>
              <Icon size={21} strokeWidth={1.5} aria-hidden="true" />
              {t(text)}
            </span>;
              })}
          </div>
          <p>
            {copy.coating.note}
          </p>
        </div>
      </div>
    </section>
    <section id="custom" className="section surface service-detail">
      <div className="container service-detail__grid">
        <figure>
          <div className="media custom-image">
            <img src={images.custom} alt={copy.custom.caption} loading="lazy" width="650" height="550" />
          </div>
          <figcaption className="image-caption">
            {copy.custom.caption}
          </figcaption>
        </figure>
        <div>
          <p className="eyebrow">
            {copy.custom.eyebrow}
          </p>
          <h2>
            {copy.custom.title}
          </h2>
          <p className="lead">
            {copy.custom.description}
          </p>
          <div className="service-tags">
            {copy.custom.tags.map(t => <span className="tag" key={t}>
              {t}
            </span>)}
          </div>
          <ul className="check-list">
            {copy.custom.features.map(t => <li key={t}>
              <Check size={17} aria-hidden="true" />
              {t}
            </li>)}
          </ul>
          <Button onClick={() => requestQuote('custom fabrication', 'Custom')}>
            {copy.quote}
          </Button>
        </div>
      </div>
    </section>
    <section id="maintenance" className="section service-detail">
      <div className="container service-detail__grid">
        <div>
          <p className="eyebrow">
            {copy.maintenance.eyebrow}
          </p>
          <h2>
            {copy.maintenance.title}
          </h2>
          <p className="lead">
            {copy.maintenance.description}
          </p>
          <button className="text-link service-text-button" type="button" onClick={() => requestQuote('maintenance and repair', 'Maintenance')}>
            {copy.quote}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
        <figure>
          <div className="media maintenance-image">
            <img src={images.mixer} alt={copy.maintenance.caption} loading="lazy" width="650" height="450" />
          </div>
          <figcaption className="image-caption">
            {copy.maintenance.caption}
          </figcaption>
        </figure>
      </div>
    </section>
  </div>
  </>;
}
