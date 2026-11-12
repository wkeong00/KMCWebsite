import { useLanguage } from '../i18n/LanguageContext';
import React, { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ArrowUpRight, Search, X, ArrowRight, MessageCircle } from 'lucide-react';
import { PageHero, useQuote } from '../Components/layout/SiteLayout';
import { Button } from '../Components/ui/Primitives';
import { categories, filterProducts } from '../data/products';
import { whatsapp } from '../data/site';
import useOverlay from '../hooks/useOverlay';
function ProductModal({
  product,
  onClose
}) {
  const { t } = useLanguage();
  const ref = useRef(null);
  const {
    requestQuote
  } = useQuote();
  useOverlay(true, ref, onClose);
  const context = `${product.model} — ${product.desc}`;
  return createPortal(<div className="overlay" onClick={e => {
    if (e.target === e.currentTarget) onClose();
  }}>
  <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title" aria-describedby="product-modal-description" ref={ref} tabIndex={-1}>
    <button type="button" className="icon-button modal-close" aria-label={t("Close product details")} onClick={onClose}>
      <X size={23} />
    </button>
    <div className="product-modal__image">
      <img src={product.img} alt={t(product.desc)} width="500" height="420" />
    </div>
    <div className="product-modal__copy">
      <p className="eyebrow">
        {t(product.category)}
      </p>
      <h2 id="product-modal-title">
        {product.model}
      </h2>
      <p id="product-modal-description" className="lead">
        {t(product.desc)}
      </p>
      <p className="product-modal__note">{t("Interested in this product? Share your quantity and requirements with us.")}</p>
      <div className="actions">
        <Button onClick={() => {
            onClose();
            requestQuote(context, 'Product');
          }}>{t("Request a quote")}</Button>
        <Button href={whatsapp(context)} variant="secondary" arrow={false} target="_blank" rel="noreferrer"><MessageCircle size={17} aria-hidden="true" />{t("WhatsApp us")}</Button>
      </div>
    </div>
  </section>
  </div>, document.body);
}
export default function ProductsPage() {
  const { t } = useLanguage();
  const [category, setCategory] = useState('All'),
    [query, setQuery] = useState(''),
    [selected, setSelected] = useState(null);
  const close = useCallback(() => setSelected(null), []);
  const results = filterProducts(category, query);
  const reset = () => {
    setCategory('All');
    setQuery('');
  };
  return <>
  <PageHero label={t("Products")} title={<>{t("Made for the way")}<br />{t("you bake.")}</>} description={t("Explore our bun trays, steamers and bakery trolleys. Need a different size or shape? Let's talk about a custom solution.")} />
  <section className="section products-section">
    <div className="container">
      <div className="catalog-heading">
        <p className="eyebrow">{t("The product collection")}</p>
        <span>{t("BAKING TRAYS / EQUIPMENT / TROLLEYS")}</span>
      </div>
      <div className="product-controls">
        <div className="filter-chips" role="group" aria-label={t("Product category")}>
          {categories.map(name => <button type="button" key={name} aria-pressed={category === name} onClick={() => setCategory(name)}>
            {t(name)}
          </button>)}
        </div>
        <div className="product-search">
          <Search size={18} aria-hidden="true" />
          <label htmlFor="product-search" className="sr-only">{t("Search products by model or description")}</label>
          <input id="product-search" type="search" placeholder={t("Search model or product…")} value={query} onChange={e => setQuery(e.target.value)} />
        </div>
      </div>
      <div className="catalog-status">
        <p role="status" aria-live="polite">
          {`${results.length} ${t(results.length === 1 ? 'product' : 'products')}${category !== 'All' ? ` / ${t(category)}` : ''}`}
        </p>
        {(category !== 'All' || query) && <button type="button" onClick={reset}>{t("Reset filters")}<X size={14} aria-hidden="true" /></button>}
      </div>
      {results.length ? <div className="product-grid">
        {results.map(product => <article className="product-card" key={product.id}>
          <button type="button" className="product-card__open" aria-label={`${t('View')} ${product.model}: ${t(product.desc)}`} onClick={() => setSelected(product)}>
            <div className="product-card__image">
              <span className="product-card__category">
                {t(product.category)}
              </span>
              <img src={product.img} alt={t(product.desc)} loading="lazy" decoding="async" width="450" height="340" />
              <span className="product-card__arrow">
                <ArrowUpRight size={20} />
              </span>
            </div>
            <div className="product-card__body">
              <p>
                {product.model}
              </p>
              <h2>
                {t(product.desc)}
              </h2>
              <span>{t("View product")}<ArrowRight size={15} aria-hidden="true" /></span>
            </div>
          </button>
        </article>)}
      </div> : <div className="empty-state">
        <Search size={32} strokeWidth={1.3} aria-hidden="true" />
        <h2>{t("No products found.")}</h2>
        <p>{t("Try a different model, keyword or category.")}</p>
        <Button variant="secondary" onClick={reset}>{t("Show all products")}</Button>
      </div>}
      <div className="catalog-custom">
        <div>
          <p className="eyebrow">{t("Something more specific?")}</p>
          <h3>{t("Your tray doesn't have to be off the shelf.")}</h3>
          <p>{t("Tell us your dimensions, material and shape.")}</p>
        </div>
        <Button to="/Services#custom" variant="secondary">{t("Explore custom fabrication")}</Button>
      </div>
    </div>
  </section>
  {selected && <ProductModal product={selected} onClose={close} />}
  </>;
}
