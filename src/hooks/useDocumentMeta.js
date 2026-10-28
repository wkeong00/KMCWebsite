import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const meta = {
  '/': ['Custom Baking Trays & PTFE Coating', 'Custom stainless steel baking trays and PTFE coating services for bakeries and food manufacturers. KMC 63 Trading, Balakong, Selangor.'],
  '/aboutus': ['About Us', 'Get to know KMC 63 Trading, a Malaysian fabrication and coating partner with over 30 years of experience.'],
  '/services': ['Coating & Custom Fabrication', 'Baking tray refurbishment, water-based PTFE coating, custom stainless steel fabrication and equipment maintenance.'],
  '/products': ['Baking Trays & Equipment', 'Explore KMC bun trays, steamers and bakery trolleys. Enquire about existing models or a custom fabrication solution.']
};
export default function useDocumentMeta() {
  const {
    pathname
  } = useLocation();
  useEffect(() => {
    const [title, description] = meta[pathname.toLowerCase()] || ['Page Not Found', 'Find custom baking trays, coating services and contact information for KMC 63 Trading.'];
    document.title = `${title} | KMC 63 Trading`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  }, [pathname]);
}
