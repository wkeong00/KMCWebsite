import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { zh } from './zh';

const LanguageContext = createContext(null);
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('kmc-language') === 'zh' ? 'zh' : 'en'; }
    catch { return 'en'; }
  });
  useEffect(() => {
    document.documentElement.lang = language === 'zh' ? 'zh-Hans' : 'en';
    try { localStorage.setItem('kmc-language', language); } catch { /* Storage may be disabled. */ }
  }, [language]);
  const t = useCallback(text => language === 'zh' && typeof text === 'string' ? (zh[text] || text) : text, [language]);
  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}
export const useLanguage = () => useContext(LanguageContext);

export function LanguageSwitch() {
  const { language, setLanguage, t } = useLanguage();
  return <div className="language-tabs" role="group" aria-label={t('Website language')}>
    {[['en', 'EN'], ['zh', '中文']].map(([value, label]) =>
      <button key={value} type="button" lang={value === 'zh' ? 'zh-Hans' : 'en'}
        aria-pressed={language === value} onClick={() => setLanguage(value)}>{label}</button>)}
  </div>;
}
