import { render, screen, within, fireEvent, waitFor, cleanup } from '@testing-library/react';
import App from './App';
beforeAll(() => {
  window.scrollTo = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
});
beforeEach(() => {
  window.matchMedia = jest.fn().mockReturnValue({ matches: true });
  process.env.REACT_APP_WEB3FORMS_KEY = 'test-public-key';
});
afterEach(() => {
  cleanup();
  jest.restoreAllMocks();
});
function open(path) {
  window.history.replaceState({}, '', path);
  return render(<App />);
}
test('category options stay available after repeated filtering and combine with search', () => {
  open('/Products');
  fireEvent.click(screen.getByRole('button', {
    name: 'Steamer',
    exact: true
  }));
  expect(screen.getByRole('status')).toHaveTextContent('4 products');
  expect(screen.getByRole('button', {
    name: 'Bun Tray',
    exact: true
  })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {
    name: 'Trolley',
    exact: true
  }));
  fireEvent.change(screen.getByRole('searchbox'), {
    target: {
      value: '720'
    }
  });
  expect(screen.getByRole('status')).toHaveTextContent('1 product');
  expect(screen.getByRole('button', {
    name: /View JS-T102:/
  })).toBeInTheDocument();
  fireEvent.change(screen.getByRole('searchbox'), {
    target: {
      value: 'no such tray'
    }
  });
  expect(screen.getByRole('heading', {
    name: 'No products found.'
  })).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {
    name: 'Show all products'
  }));
  expect(screen.getByRole('status')).toHaveTextContent('12 products');
});
test('product dialog traps focus, closes with Escape, restores its trigger and carries quote context', async () => {
  open('/Products');
  const trigger = screen.getByRole('button', {
    name: /View JS20108:/
  });
  trigger.focus();
  fireEvent.click(trigger);
  let dialog = screen.getByRole('dialog');
  expect(within(dialog).getByRole('heading', {
    name: 'JS20108'
  })).toBeInTheDocument();
  const close = within(dialog).getByRole('button', {
    name: 'Close product details'
  });
  expect(close).toHaveFocus();
  fireEvent.keyDown(close, {
    key: 'Tab',
    shiftKey: true
  });
  expect(within(dialog).getByRole('link', {
    name: 'WhatsApp us'
  })).toHaveFocus();
  fireEvent.keyDown(dialog, {
    key: 'Escape'
  });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
  fireEvent.click(trigger);
  dialog = screen.getByRole('dialog');
  expect(within(dialog).getByRole('link', {
    name: 'WhatsApp us'
  })).toHaveAttribute('href', expect.stringContaining('JS20108'));
  fireEvent.click(within(dialog).getByRole('button', {
    name: 'Request a quote'
  }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(screen.getByLabelText(/Tell us what you need/)).toHaveValue('I would like a quote for JS20108 — Aluminized Steel Hot Dog Bun Tray (15 Grooves).\n\nMy requirements: ');
  expect(screen.getByLabelText("I'm interested in")).toHaveValue('Product');
  await waitFor(() => expect(screen.getByLabelText(/Your name/)).toHaveFocus());
});
test('service language tabs support keyboard selection and quote service selection', () => {
  open('/Services');
  const english = screen.getByRole('tab', {
    name: 'EN'
  });
  english.focus();
  fireEvent.keyDown(english, {
    key: 'ArrowRight'
  });
  expect(screen.getByRole('tab', {
    name: '中文'
  })).toHaveAttribute('aria-selected', 'true');
  expect(screen.getByRole('tabpanel')).toHaveAttribute('lang', 'zh-Hans');
  expect(screen.getByRole('heading', {
    name: '为您的烤盘，换上新涂层。'
  })).toBeInTheDocument();
  fireEvent.click(screen.getAllByRole('button', {
    name: '咨询您的需求'
  })[0]);
  expect(screen.getByLabelText("I'm interested in")).toHaveValue('Coating');
  fireEvent.keyDown(screen.getByRole('tab', {
    name: '中文'
  }), {
    key: 'Home'
  });
  expect(screen.getByRole('heading', {
    name: 'Give your trays a fresh start.'
  })).toBeInTheDocument();
});
test('mobile navigation closes with Escape and returns focus to its opener', () => {
  open('/');
  const toggle = screen.getByRole('button', {
    name: 'Open navigation'
  });
  toggle.focus();
  fireEvent.click(toggle);
  expect(screen.getByRole('dialog', {
    name: 'Navigation'
  })).toBeInTheDocument();
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  fireEvent.keyDown(screen.getByRole('dialog'), {
    key: 'Escape'
  });
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(toggle).toHaveFocus();
});
test('form retains details after a network failure and prevents duplicate submissions while sending', async () => {
  open('/');
  let rejectRequest;
  global.fetch = jest.fn(() => new Promise((resolve, reject) => {
    rejectRequest = reject;
  }));
  fireEvent.change(screen.getByLabelText(/Your name/), {
    target: {
      value: 'Local QA'
    }
  });
  fireEvent.change(screen.getByLabelText(/Phone number/), {
    target: {
      value: '+60000000000'
    }
  });
  fireEvent.change(screen.getByLabelText(/Tell us what you need/), {
    target: {
      value: 'A custom tray for local testing'
    }
  });
  const form = screen.getByRole('form', {
    name: 'Request a quote'
  });
  fireEvent.submit(form);
  fireEvent.submit(form);
  expect(global.fetch).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button', {
    name: 'Sending enquiry'
  })).toBeDisabled();
  rejectRequest(new Error('Offline'));
  await screen.findByText(/We could not send your enquiry/);
  expect(screen.getByLabelText(/Your name/)).toHaveValue('Local QA');
  expect(screen.getByLabelText(/Tell us what you need/)).toHaveValue('A custom tray for local testing');
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      success: true
    })
  });
  fireEvent.submit(form);
  await screen.findByText('Thank you for your enquiry.');
  expect(screen.getByLabelText(/Your name/)).toHaveValue('');
  expect(screen.getByLabelText(/Tell us what you need/)).toHaveValue('');
});
test('unknown routes render a useful 404 page', () => {
  open('/does-not-exist');
  expect(screen.getByText('404 / Page not found')).toBeInTheDocument();
  expect(screen.getByRole('link', {
    name: 'Back to home'
  })).toHaveAttribute('href', '/');
});
