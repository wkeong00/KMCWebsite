import JS20108 from '../Assets/enhanced/JS20108.jpg';
import JS20208 from '../Assets/enhanced/JS20208.jpg';
import JS20308 from '../Assets/enhanced/JS20308.jpg';
import JS30108 from '../Assets/enhanced/JS30108.jpg';
import JS30208 from '../Assets/enhanced/JS30208.jpg';
import JS30308 from '../Assets/enhanced/JS30308.jpg';
import JSGS01 from '../Assets/enhanced/JS-GS01-Steamer.jpg';
import JSGS02 from '../Assets/enhanced/JS-GS02.jpg';
import Trolley from '../Assets/enhanced/Trolley.jpg';
import thirdgen from '../Assets/enhanced/thirdgen.png';
import fourth from '../Assets/enhanced/fourth.png';

// Keep stable IDs: model codes in the existing catalog can repeat.
export const products = [{
  id: "1",
  model: "JS20108",
  category: "Bun Tray",
  img: JS20108,
  desc: "Aluminized Steel Hot Dog Bun Tray (15 Grooves)"
}, {
  id: "2",
  model: "JS20208",
  category: "Bun Tray",
  img: JS20208,
  desc: "Aluminized Steel Hot Dog Bun Tray (15 Grooves)"
}, {
  id: "3",
  model: "JS20308",
  category: "Bun Tray",
  img: JS20308,
  desc: "Aluminized Steel Burger Bun Tray (15 Grooves)"
}, {
  id: "4",
  model: "JS30108",
  category: "Bun Tray",
  img: JS30108,
  desc: "Aluminized Steel long Bun Tray (18 Grooves)"
}, {
  id: "5",
  model: "JS30208",
  category: "Bun Tray",
  img: JS30208,
  desc: "Aluminized Steel long Bun Tray (12 Grooves)"
}, {
  id: "6",
  model: "JS30308",
  category: "Bun Tray",
  img: JS30308,
  desc: "Aluminized Steel long Bun Tray (7 Grooves)"
}, {
  id: "7",
  model: "JSGS01",
  category: "Steamer",
  img: JSGS01,
  desc: "Single Door Type Steamer with Trolley (Gas heated steamer)"
}, {
  id: "8",
  model: "JSGS01",
  category: "Steamer",
  img: JSGS02,
  desc: "Single Door Type Steamer with Trolley (Gas heated oil insulated steamer)"
}, {
  id: "9",
  model: "JS-T101",
  category: "Trolley",
  img: Trolley,
  desc: "Bakery Trolley (For 600 x 400 baking tray)"
}, {
  id: "10",
  model: "JS-T102",
  category: "Trolley",
  img: Trolley,
  desc: "Bakery Trolley (For 720 x 460 baking tray)"
}, {
  id: "11",
  model: "JSGS02",
  category: "Steamer",
  img: thirdgen,
  desc: "Third gen Multipurpose Steamer with Trolley"
}, {
  id: "12",
  model: "JSGS03",
  category: "Steamer",
  img: fourth,
  desc: "Fourth Gen Multipurpose Steamer with Trolley"
}];
export const categories = ['All', ...new Set(products.map(product => product.category))];
export function filterProducts(category, query) {
  const term = query.trim().toLowerCase();
  return products.filter(product => (category === 'All' || product.category === category) && `${product.model} ${product.desc} ${product.category}`.toLowerCase().includes(term));
}
