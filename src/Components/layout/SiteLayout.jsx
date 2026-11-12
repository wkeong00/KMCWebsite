import { useLanguage, LanguageSwitch } from '../../i18n/LanguageContext';
import React, { useState, useRef, useCallback, useEffect, createContext, useContext } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Mail, Phone, MapPin } from 'lucide-react';
import { images } from '../../data/images';
import { site, links, whatsapp } from '../../data/site';
import { Button } from '../ui/Primitives';
import useOverlay from '../../hooks/useOverlay';
const QuoteContext = createContext(null);
export const useQuote = () => useContext(QuoteContext);
export function QuoteProvider({
  children
}) {
  const [quote, setQuote] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const requestQuote = (context = '', service = 'Other') => {
    setQuote({
      context,
      service,
      id: Date.now()
    });
    navigate(`${location.pathname}#contact`, {
      state: {
        focusContact: true
      }
    });
  };
  return <QuoteContext.Provider value={{
    quote,
    requestQuote
  }}>
  {children}
  </QuoteContext.Provider>;
}
export function RouteEffects() {
  const location = useLocation();
  useEffect(() => {
    const timer = setTimeout(() => {
      if (location.hash) {
        const element = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        element?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start'
        });
        if (location.state?.focusContact) document.getElementById('contact-name')?.focus({
          preventScroll: true
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: 'instant'
        });
        document.getElementById('main-content')?.focus({
          preventScroll: true
        });
      }
    }, 80);
    return () => clearTimeout(timer);
  }, [location]);
  return null;
}
function Brand({
  footer = false,
  onClick
}) {
  const { t } = useLanguage();
  return <Link className={`brand ${footer ? 'brand--footer' : ''}`} to="/" aria-label={t("KMC 63 Trading home")} onClick={onClick}>
  <img src={footer ? images.logoLight : images.logo} alt="KMC 63 Trading" width="1120" height="210" />
  </Link>;
}
export function Navbar() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false),
    [scrolled, setScrolled] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useOverlay(open, ref, close);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, {
      passive: true
    });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return <>
  <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
    <div className="container navbar__inner">
      <Brand />
      <nav className="navbar__links" aria-label={t("Main navigation")}>
        {links.map(([label, to]) => <NavLink key={to} to={to} end={to === '/'} className={({
            isActive
          }) => isActive ? 'navbar__link navbar__link--active' : 'navbar__link'}>
          {t(label)}
        </NavLink>)}
      </nav>
      <Button to="#contact" className="navbar__quote">{t("Get a Quote")}</Button>
      <LanguageSwitch />
      <button type="button" className="menu-toggle" aria-label={t("Open navigation")} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(true)}>
        <Menu size={24} />
      </button>
    </div>
  </header>
  {open && createPortal(<div className="overlay mobile-overlay" onClick={event => {
      if (event.target === event.currentTarget) close();
    }}>
    <div id="mobile-navigation" className="mobile-panel" role="dialog" aria-modal="true" aria-label={t("Navigation")} ref={ref} tabIndex={-1}>
      <div className="mobile-panel__top">
        <Brand onClick={close} />
        <button type="button" className="icon-button" aria-label={t("Close navigation")} onClick={close}>
          <X />
        </button>
      </div>
      <p className="eyebrow">{t("Explore KMC")}</p>
      <nav aria-label={t("Mobile navigation")}>
        {links.map(([label, to], i) => <NavLink key={to} to={to} end={to === '/'} onClick={close}>
          <span>0{i + 1}</span>
          {t(label)}
          <ArrowUpRight size={23} />
        </NavLink>)}
      </nav>
      <Button to="#contact" onClick={close}>{t("Request a Quote")}</Button>
      <a className="mobile-panel__phone" href={`tel:${site.phoneLink}`}>
        {site.phone}
      </a>
    </div>
  </div>, document.body)}
  </>;
}
export function Footer() {
  const { t } = useLanguage();
  return <footer className="footer">
  <div className="container">
    <div className="footer__grid">
      <div className="footer__intro">
        <Brand footer />
        <p>{t("Built for your bakery.")}<br />{t("Made to your requirements.")}</p>
        <div className="footer__social">
          <a href="https://www.instagram.com/kmc63_bakingtray/" target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={13} /></a>
          <a href="https://www.facebook.com/profile.php?id=61558628079399" target="_blank" rel="noreferrer">Facebook <ArrowUpRight size={13} /></a>
        </div>
      </div>
      <div>
        <h2>{t("Explore")}</h2>
        {links.map(([label, to]) => <Link to={to} key={to}>
          {t(label)}
        </Link>)}
      </div>
      <div>
        <h2>{t("Our expertise")}</h2>
        <Link to="/Services#coating">{t("Coating & refurbishment")}</Link>
        <Link to="/Services#custom">{t("Custom fabrication")}</Link>
        <Link to="/Services#maintenance">{t("Maintenance & repair")}</Link>
        <a href={whatsapp()} target="_blank" rel="noreferrer">{t("WhatsApp us")}<ArrowUpRight size={13} /></a>
      </div>
      <div className="footer__contact">
        <h2>{t("Let's talk")}</h2>
        <a href={`tel:${site.phoneLink}`}>
          {site.phone}
        </a>
        <a href={`mailto:${site.email}`}>
          {site.email}
        </a>
        <p>{t("Balakong, Selangor")}<br />{t("Malaysia")}</p>
      </div>
    </div>
    <div className="footer__bottom">
      <span>© {new Date().getFullYear()} KMC 63 Trading. {t('All rights reserved.')}</span>
      <span>002944165P / 201903066683</span>
    </div>
  </div>
  </footer>;
}
export function PageHero({
  label,
  title,
  description,
  image,
  alt
}) {
  const { t } = useLanguage();
  return <section className="page-hero surface">
  <div className="container">
    <nav className="breadcrumbs" aria-label={t("Breadcrumb")}>
      <Link to="/">{t("Home")}</Link>
      <span aria-hidden="true">/</span>
      <span aria-current="page">
        {t(label)}
      </span>
    </nav>
    <div className={`page-hero__grid ${!image ? 'page-hero__grid--text' : ''}`}>
      <div>
        <p className="eyebrow">KMC 63 Trading / {t(label)}</p>
        <h1>
          {title}
        </h1>
        <p className="lead">
          {description}
        </p>
      </div>
      {image && <div className="media">
        <img src={image} alt={alt} fetchpriority="high" width="700" height="460" />
      </div>}
    </div>
  </div>
  </section>;
}
export function CTABand() {
  const { t } = useLanguage();
  return <div className="cta-band">
  <div className="container cta-band__inner">
    <div>
      <p className="eyebrow">{t("Made around your requirements")}</p>
      <h2>{t("Have a custom tray in mind?")}</h2>
      <p>{t("Tell us your dimensions, material and coating requirements.")}</p>
    </div>
    <Button href={whatsapp()} variant="inverse" target="_blank" rel="noreferrer">{t("Let's talk on WhatsApp")}</Button>
  </div>
  </div>;
}
export function ContactDetails() {
  const { t } = useLanguage();
  return <div className="contact-details">
  <a href={`tel:${site.phoneLink}`}>
    <span className="icon-box">
      <Phone size={19} />
    </span>
    <span>
      <small>{t("Call us")}</small>
      {site.phone}
    </span>
    <ArrowUpRight size={16} />
  </a>
  <a href={`mailto:${site.email}`}>
    <span className="icon-box">
      <Mail size={19} />
    </span>
    <span>
      <small>{t("Email us")}</small>
      {site.email}
    </span>
    <ArrowUpRight size={16} />
  </a>
  <a href={site.map} target="_blank" rel="noreferrer">
    <span className="icon-box">
      <MapPin size={19} />
    </span>
    <span>
      <small>{t("Visit our workshop")}</small>
      {site.address}
    </span>
    <ArrowUpRight size={16} />
  </a>
  </div>;
}
export function NotFound() {
  const { t } = useLanguage();
  return <section className="section not-found">
  <div className="container">
    <p className="eyebrow">{t("404 / Page not found")}</p>
    <h1>{t("Let's get you")}<br />{t("back on track.")}</h1>
    <p className="lead">{t("The page you're looking for could not be found.")}</p>
    <Button to="/">{t("Back to home")}</Button>
  </div>
  </section>;
}
