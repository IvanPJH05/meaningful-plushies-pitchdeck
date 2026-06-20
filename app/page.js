import ScrollStory from '@/components/ScrollStory';
import HeroReveal from '@/components/HeroReveal';
import { assetUrl } from '@/lib/assets';

export default function Home() {
  return (
    <main>
      <header className="site-header" aria-label="Primary navigation">
        <a className="brand" href="#top" aria-label="Meaningful Plushies home"><img src={assetUrl('/assets/logo.png')} alt="" /><span>Influencer Studio</span></a>
        <nav className="nav-links" aria-label="Main navigation"><a href="#story">Story</a><a href="#proof">Proof</a><a href="#contact">Start</a></nav>
        <a className="nav-cta" href="#contact">Book intro</a>
      </header>

      <HeroReveal />

      <div id="story"><ScrollStory height="680vh" /></div>

      <section id="proof" className="proof-section" aria-labelledby="proof-title"><div><p className="eyebrow">Built for plushie launches</p><h2 id="proof-title">Make creator acquisition feel as thoughtful as the product.</h2></div><div className="proof-grid"><article><span>Warm sourcing</span><strong>Find creators whose audience already loves cute, cozy, giftable moments.</strong></article><article><span>Plush-specific ranking</span><strong>Prioritize creators by content fit, response likelihood, and sample potential.</strong></article><article><span>Launch clarity</span><strong>Know which plush characters, hooks, and creator niches produce the best posts.</strong></article></div></section>

      <section id="contact" className="contact-section" aria-labelledby="contact-title"><div className="contact-copy"><p className="eyebrow">Start the creator list</p><h2 id="contact-title">Build the first Meaningful Plushies creator wave.</h2><p>Add more story objects in one data file, drop product videos into public assets, and tune the scroll timing without rewriting the component.</p></div><form className="lead-form"><label>Work email<input type="email" name="email" placeholder="you@brand.com" required /></label><label>Creator category<select name="category" defaultValue="Gift guides"><option>Gift guides</option><option>Plush collectors</option><option>Kawaii lifestyle</option><option>Desk setup creators</option><option>Parent creators</option><option>Other</option></select></label><button type="submit">Request intro</button></form></section>
    </main>
  );
}
