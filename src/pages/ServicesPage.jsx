import React, { useState, useRef } from 'react';
import { Check, ArrowRight, ShieldCheck, Thermometer, Layers, Droplets } from 'lucide-react';
import { PageHero, useQuote } from '../Components/layout/SiteLayout';
import { Button } from '../Components/ui/Primitives';
import { serviceCopy } from '../data/services';
import { images } from '../data/images';
export default function ServicesPage() {
  const [language, setLanguage] = useState('en');
  const tabs = useRef([]);
  const copy = serviceCopy[language];
  const {
    requestQuote
  } = useQuote();
  function keydown(event, index) {
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = 1 - index;else if (event.key === 'Home') next = 0;else if (event.key === 'End') next = 1;else return;
    event.preventDefault();
    setLanguage(next === 0 ? 'en' : 'zh');
    tabs.current[next]?.focus();
  }
  return <>
  <PageHero label="Services" title={<>Made for your needs.<br />Finished for your work.</>} description="Two core specialties, one workshop. Custom trays and PTFE coating services, supported by maintenance and repair." image={images.coating} alt="A KMC technician applying a coating to a baking tray" />
  <div className="service-toolbar">
    <div className="container service-toolbar__inner">
      <nav aria-label="Service sections">
        {['coating', 'custom', 'maintenance'].map((id, i) => <a href={`#${id}`} key={id}>
          {copy.nav[i]}
        </a>)}
      </nav>
      <div className="language-tabs" role="tablist" aria-label="Service content language">
        {[['en', 'EN'], ['zh', '中文']].map(([lang, label], i) => <button type="button" role="tab" id={`language-${lang}`} aria-selected={language === lang} aria-controls="service-content" tabIndex={language === lang ? 0 : -1} ref={el => tabs.current[i] = el} key={lang} onKeyDown={e => keydown(e, i)} onClick={() => setLanguage(lang)}>
          {label}
        </button>)}
      </div>
    </div>
  </div>
  <div id="service-content" role="tabpanel" aria-labelledby={`language-${language}`} lang={language === 'zh' ? 'zh-Hans' : 'en'} className={`service-content ${language === 'zh' ? 'service-content--zh' : ''}`}>
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
                {text}
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
              {text}
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
