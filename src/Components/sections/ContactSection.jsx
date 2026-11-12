import { useLanguage } from '../../i18n/LanguageContext';
import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle2, ArrowRight, LoaderCircle, MessageCircle } from 'lucide-react';
import { ContactDetails, useQuote } from '../layout/SiteLayout';
import { site, whatsapp } from '../../data/site';
export default function ContactSection() {
  const { t, language } = useLanguage();
  const quoteLanguage = useRef({ language, t });
  quoteLanguage.current = { language, t };
  const {
    quote
  } = useQuote();
  const [service, setService] = useState('Other');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const submitting = useRef(false);
  const controller = useRef(null);
  useEffect(() => {
    if (quote) {
      const { language, t } = quoteLanguage.current;
      setService(quote.service);
      setMessage(quote.context ? language === 'zh' ? `我想咨询${t(quote.context)}的报价。\n\n我的需求：` : `I would like a quote for ${quote.context}.\n\nMy requirements: ` : '');
      setStatus('idle');
      setError('');
    }
  }, [quote]);
  useEffect(() => () => controller.current?.abort(), []);
  async function submit(event) {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const key = process.env.REACT_APP_WEB3FORMS_KEY;
    if (!key) {
      setStatus('error');
      setError('The enquiry form is temporarily unavailable. Please contact us by email or WhatsApp.');
      return;
    }
    submitting.current = true;
    setStatus('sending');
    setError('');
    controller.current = new AbortController();
    const timeout = setTimeout(() => controller.current?.abort(), 20000);
    try {
      const body = new FormData(form);
      body.append('access_key', key);
      body.append('subject', `KMC website enquiry — ${service}`);
      body.append('from_name', 'KMC Website');
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body,
        signal: controller.current.signal
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error('Submission failed');
      setStatus('success');
      setMessage('');
      setService('Other');
      form.reset();
    } catch (err) {
      setStatus('error');
      setError('We could not send your enquiry. Your details are still here. Please try again, or contact us on WhatsApp.');
    } finally {
      clearTimeout(timeout);
      submitting.current = false;
    }
  }
  return <section id="contact" className="section contact-section">
  <div className="container contact-grid">
    <div className="contact-copy">
      <p className="eyebrow">{t("Start a conversation")}</p>
      <h2>{t("Good work starts")}<br />{t("with your requirements.")}</h2>
      <p className="lead">{t("A new tray, a fresh coating, or a custom idea. Share what you need and let's work through the details.")}</p>
      <ContactDetails />
      <details className="contact-map">
        <summary>{t("Find our workshop on the map")}</summary>
        <iframe title={t("KMC 63 Trading workshop location")} src={site.mapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
      </details>
      <a className="text-link" href={whatsapp(quote?.context)} target="_blank" rel="noreferrer"><MessageCircle size={18} aria-hidden="true" />{t("Prefer WhatsApp? Chat with us")}<ArrowRight size={16} aria-hidden="true" /></a>
    </div>
    <div className="contact-form-wrap">
      <div className="form-heading">
        <h3>{t("Request a quote")}</h3>
        <span>{t("Let's make it happen.")}</span>
      </div>
      <form onSubmit={submit} aria-label={t("Request a quote")} aria-busy={status === 'sending'}>
        <div className="form-row">
          <div className="field">
            <label htmlFor="contact-name">{t("Your name")}<span>*</span></label>
            <input id="contact-name" name="name" autoComplete="name" placeholder={t("Full name")} required maxLength={120} />
          </div>
          <div className="field">
            <label htmlFor="contact-company">{t("Company")}</label>
            <input id="contact-company" name="company" autoComplete="organization" placeholder={t("Company name")} maxLength={160} />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="contact-phone">{t("Phone number")}<span>*</span></label>
            <input id="contact-phone" name="phone" type="tel" autoComplete="tel" placeholder="+60" required maxLength={40} />
          </div>
          <div className="field">
            <label htmlFor="contact-email">{t("Email")}</label>
            <input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@company.com" maxLength={200} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="contact-service">{t("I'm interested in")}</label>
          <select id="contact-service" name="service" value={service} onChange={e => setService(e.target.value)}>
            <option value="Other">{t("Select a service / General enquiry")}</option>
            <option value="Coating">{t("Coating & refurbishment")}</option>
            <option value="Custom">{t("Custom fabrication")}</option>
            <option value="Product">{t("A product")}</option>
            <option value="Maintenance">{t("Maintenance & repair")}</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="contact-message">{t("Tell us what you need")}<span>*</span></label>
          <textarea id="contact-message" name="message" rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder={t("Tray dimensions, quantity, material or coating requirements…")} required maxLength={5000} />
        </div>
        <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" hidden aria-hidden="true" />
        <p className="form-note">{t("Your details will only be used to respond to your enquiry.")}</p>
        <button type="submit" className="button button--primary form-submit" disabled={status === 'sending'}>
          {status === 'sending' ? <>{t("Sending enquiry")}<LoaderCircle className="spinner" size={17} /></> : <>{t("Send enquiry")}<ArrowRight size={17} aria-hidden="true" /></>}
        </button>
        <div className="form-feedback" aria-live="polite" aria-atomic="true">
          {status === 'success' && <div className="form-success">
            <CheckCircle2 size={22} aria-hidden="true" />
            <span><strong>{t("Thank you for your enquiry.")}</strong><br />{t("Your message has been sent to KMC 63 Trading.")}</span>
          </div>}
          {status === 'error' && <p className="form-error">
            {t(error)}
          </p>}
        </div>
      </form>
    </div>
  </div>
  </section>;
}
