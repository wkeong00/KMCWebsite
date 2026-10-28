import React from 'react';
import { Ruler, Layers, Handshake } from 'lucide-react';
import { PageHero } from '../Components/layout/SiteLayout';
import { SectionHeading } from '../Components/ui/Primitives';
import { Capabilities, Gallery } from '../Components/sections/SharedSections';
import { images } from '../data/images';
export default function AboutPage() {
  return <>
  <PageHero label="About" title={<>Experience in the craft.<br />Care in every tray.</>} description="A Malaysian fabrication and coating partner for bakeries and food manufacturers, with over 30 years of experience." image={images.exterior} alt="The KMC 63 Trading workshop exterior in Balakong" />
  <section className="section">
    <div className="container story-grid">
      <div>
        <p className="eyebrow">Our story</p>
        <h2>Practical expertise.<br />Personal attention.</h2>
      </div>
      <div className="story-copy">
        <p className="lead">We make baking trays around the needs of the people who use them.</p>
        <p>Based in Balakong, Selangor, KMC 63 Trading brings together custom stainless steel fabrication and professional coating services. Our work includes bun trays, baking pans and custom shapes for bakeries, food factories and distributors.</p>
        <p>Some projects start with a drawing. Others start with a well-used tray that needs a fresh finish. We work through the dimensions, materials and coating requirements with you to find a practical solution.</p>
        <p>Our focus is straightforward: careful craftsmanship, reliable products and a working relationship built on understanding your needs.</p>
      </div>
    </div>
  </section>
  <Capabilities />
  <section className="section">
    <div className="container">
      <SectionHeading eyebrow="What we care about" title="The details make the difference." />
      <div className="values-grid">
        {[[Ruler, '01', 'Precision', 'Dimensions, shapes and tray profiles tailored to the way you bake.'], [Layers, '02', 'Durability', 'Materials and non-stick finishes selected for your baking requirements.'], [Handshake, '03', 'Partnership', 'A direct conversation, from your initial enquiry to your next order.']].map(([Icon, n, title, text]) => <article className="value-card" key={title}>
          <div>
            <Icon size={28} strokeWidth={1.4} aria-hidden="true" />
            <span>
              {n}
            </span>
          </div>
          <h3>
            {title}
          </h3>
          <p>
            {text}
          </p>
        </article>)}
      </div>
    </div>
  </section>
  <Gallery title="Step inside our workshop." />
  </>;
}
