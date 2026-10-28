import { useEffect } from 'react';
// Both overlays live in a portal, outside the isolated page shell.
export default function useOverlay(open, ref, close) {
  useEffect(() => {
    if (!open || !ref.current) return;
    const panel = ref.current,
      previousFocus = document.activeElement,
      previousOverflow = document.body.style.overflow;
    const background = document.getElementById('site-shell');
    if (background) background.setAttribute('inert', '');
    document.body.style.overflow = 'hidden';
    const focusables = () => Array.from(panel.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex="0"]')).filter(el => !el.hidden);
    (focusables()[0] || panel).focus();
    const handleKey = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
      }
      if (event.key !== 'Tab') return;
      const items = focusables(),
        first = items[0],
        last = items[items.length - 1];
      if (!first) {
        event.preventDefault();
        panel.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    panel.addEventListener('keydown', handleKey);
    return () => {
      panel.removeEventListener('keydown', handleKey);
      document.body.style.overflow = previousOverflow;
      if (background) background.removeAttribute('inert');
      if (previousFocus?.isConnected) previousFocus.focus({
        preventScroll: true
      });
    };
  }, [open, ref, close]);
}
