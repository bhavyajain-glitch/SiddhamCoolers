import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const showcaseProducts = [
  {
    id: '662b6cf07a2a514d2e1b1234', // Dummy ID, will link to Airmax 85 if available or redirect
    name: 'Airmax 85',
    series: 'Desert Series',
    desc: 'Heavy Duty Fiber Cooler 18" with maximum airflow for large spaces.',
    price: '₹14,199',
    image: 'https://siddham-coolers-api.onrender.com/assets/Airmax%2085%20.png',
  },
  {
    id: '662b6cf07a2a514d2e1b1235', // Dummy ID, Cool Max 125
    name: 'Cool Max 125',
    series: 'Industrial',
    desc: 'Ultimate Commercial Cooling Power. Dominate the heat with commercial-grade comfort.',
    price: '₹18,999',
    image: 'https://siddham-coolers-api.onrender.com/assets/Cool%20Max%20125.png',
    highlight: true,
  },
  {
    id: '662b6cf07a2a514d2e1b1236',
    name: 'Chiller 40 GT',
    series: 'Personal Series',
    desc: 'Smart Cooling. Powerful Performance. Engineered for compact spaces.',
    price: '₹8,799',
    image: 'https://siddham-coolers-api.onrender.com/assets/Chiller%2040%20GT.png',
    highlight: false,
  },
];

const testimonials = [
  {
    name: 'Elena R.',
    product: 'Aero Pure X1 Owner',
    text: '"It doesn\'t just cool the room; it changes the entire atmosphere. The silent mode is truly silent, unlike any other cooler I\'ve owned."',
    rating: 5,
  },
  {
    name: 'Marcus T.',
    product: 'Aero Compact Owner',
    text: '"Visually stunning. It blends right into my studio apartment while keeping it freezing during peak summer. The design is impeccable."',
    rating: 5,
  },
];

const specs = [
  { icon: 'water_voc', label: 'Capacity', value: '120L' },
  { icon: 'storm', label: 'Air Throw', value: '65 ft' },
  { icon: 'bolt', label: 'Power Draw', value: '185W' },
  { icon: 'aspect_ratio', label: 'Coverage Area', value: '800 sq.ft', accent: true },
];

const cities = ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Austin', 'Seattle'];

export default function Home() {
  return (
    <main className="pt-0">
      {/* ─── 1. HERO ─── */}
      <header className="relative w-full min-h-screen flex items-center justify-center bg-surface overflow-hidden pt-32 pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-surface via-surface to-primary-fixed/30 opacity-70" />
        <div className="relative z-10 max-w-[1920px] mx-auto px-6 md:px-12 flex flex-col items-center w-full">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h1 className="font-headline text-6xl md:text-[5.5rem] font-bold text-on-background leading-[1.05] tracking-tight mb-6">
              Minimal Cooling.
            </h1>
            <p className="font-body text-xl md:text-2xl text-on-surface-variant font-light tracking-wide max-w-2xl mx-auto">
              Engineered for maximum airflow and silent performance. The aesthetics of pure atmosphere.
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="relative w-full max-w-5xl mx-auto flex justify-center items-center"
          >
            <img
              alt="Siddham Cooler"
              className="w-full max-w-2xl object-cover rounded-[2rem] ambient-shadow-lg z-10 mix-blend-multiply"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAaarBtbgwXIN9_HnRgXkO7U_FO7qee87FAVS-Yrg_mgS8DLRBbAHkkBuvI2r5mwXiRbkLqGuHzHAW7uYvtCVFFkjgPViP6eQ9oWNHeqwqIT_kuAUh-vAttZfl3G9Vl_XG4xXzWCn9rqJbxA_hQ1MYVIcJaBeDKNUZvQ7qEtqUILiSAjFvuM1zjlV7kVnG2te2WBfqpqcxt5ER0XtEAtSsar6KVAYmFgf_ZZ027EXrHbqVFlWkP2TwM-BsqGxXu6i4_Nyx4K3NvQNo"
            />
            {/* Floating Card */}
            <div className="absolute bottom-10 right-0 md:-right-10 bg-surface-container-lowest/80 backdrop-blur-2xl p-8 rounded-2xl ambient-shadow-lg z-20 w-80 ring-1 ring-outline-variant/15 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-primary mb-1 block">Flagship</span>
                  <h3 className="font-headline text-[1.125rem] font-medium text-on-background">Aero Pure X1</h3>
                </div>
                <span className="font-body text-lg font-light text-on-surface-variant">$499</span>
              </div>
              <div className="flex gap-2 mb-2">
                <span className="bg-primary-fixed/60 text-on-primary-fixed rounded-full px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-wider">Silent Mode</span>
                <span className="bg-primary-fixed/60 text-on-primary-fixed rounded-full px-3 py-1 text-[0.6875rem] font-bold uppercase tracking-wider">Eco-Cool</span>
              </div>
              <Link to="/product/1" className="w-full btn-gradient text-on-primary font-medium py-3 rounded-xl hover:opacity-90 transition-opacity text-center">
                Buy Now
              </Link>
            </div>
          </motion.div>
        </div>
      </header>

      {/* ─── 2. BRAND INTRO ─── */}
      <section className="w-full bg-surface-container-low py-40 px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center flex flex-col items-center"
        >
          <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-primary mb-8">Who we are</span>
          <h2 className="font-headline text-4xl md:text-[2.5rem] font-semibold text-on-background leading-tight mb-10">
            We believe atmosphere should be felt, not heard.
          </h2>
          <p className="font-body text-lg md:text-xl text-on-surface-variant font-light leading-relaxed max-w-3xl">
            Siddham was founded on a singular premise: climate control is a core component of a well-designed life. By merging aerospace-grade fluid dynamics with architectural minimalism, we've created cooling systems that integrate seamlessly into your environment while outperforming industrial standards.
          </p>
        </motion.div>
      </section>

      {/* ─── 3. PERFORMANCE ─── */}
      <section className="w-full bg-surface py-32 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full md:w-1/2"
            >
              <h2 className="font-headline text-[2.0rem] font-semibold text-on-background mb-6">What makes it powerful.</h2>
              <p className="font-body text-[0.875rem] text-on-surface-variant font-light leading-relaxed mb-10 max-w-md">
                Our proprietary cyclonic delivery system compresses and accelerates air, resulting in a deeper, colder throw that drops room temperatures significantly faster than conventional bladed systems.
              </p>
            </motion.div>
            <div className="w-full md:w-1/2 flex flex-col gap-8">
              {/* Regular Bar */}
              <motion.div 
                initial={{ opacity: 0, width: "0%" }}
                whileInView={{ opacity: 1, width: "100%" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-3"
              >
                <div className="flex justify-between items-end">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-on-surface-variant">Regular Cooler</span>
                  <span className="text-[0.875rem] font-light text-on-surface-variant">Standard Airflow</span>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-tertiary w-[60%] rounded-full" />
                </div>
              </motion.div>
              {/* Siddham Bar */}
              <motion.div 
                initial={{ opacity: 0, width: "0%" }}
                whileInView={{ opacity: 1, width: "100%" }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-3"
              >
                <div className="flex justify-between items-end">
                  <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-primary">Siddham Aero Pure</span>
                  <span className="text-[0.875rem] font-medium text-primary">+30% Faster Cooling</span>
                </div>
                <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-primary-container w-[90%] rounded-full" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. SHOWCASE ─── */}
      <section className="w-full bg-surface-container-low py-32 px-6 md:px-12">
        <div className="max-w-[1920px] mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-20"
          >
            <h2 className="font-headline text-[2.0rem] font-semibold text-on-background">Meet Our Coolers.</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {showcaseProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                className={product.highlight ? 'relative md:-top-12 z-10' : ''}
              >
                <Link
                  to={`/product/${product.id}`}
                  className="block h-full bg-surface-container-lowest rounded-2xl ambient-shadow-sm overflow-hidden group cursor-pointer"
                >
                  <div className={`${product.highlight ? 'h-[28rem]' : 'h-96'} w-full bg-surface-container flex items-center justify-center overflow-hidden relative`}>
                    {product.highlight && (
                    <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest/50 to-transparent z-10" />
                  )}
                  <img
                    alt={product.name}
                    className={`w-full h-full object-cover ${!product.highlight ? 'opacity-90' : ''} group-hover:scale-105 transition-transform duration-700`}
                    style={{ transitionTimingFunction: 'cubic-bezier(0.2, 0, 0, 1)' }}
                    src={product.image}
                  />
                </div>
                <div className="p-8 flex flex-col items-center text-center">
                  <span className={`text-[0.6875rem] font-bold uppercase tracking-widest mb-2 ${product.highlight ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {product.series}
                  </span>
                  <h3 className="font-headline text-[1.125rem] font-medium text-on-background mb-4">{product.name}</h3>
                  <p className="font-body text-[0.875rem] text-on-surface-variant font-light mb-6">{product.desc}</p>
                    <span className="font-body text-lg font-light text-on-background">{product.price}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 5. FEATURE STORY ─── */}
      <section className="w-full bg-surface py-32 px-6 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-5/12 order-2 md:order-1 flex flex-col items-start"
          >
            <span className="text-[0.6875rem] font-bold uppercase tracking-widest text-primary mb-6">Fluid Dynamics</span>
            <h2 className="font-headline text-[2.0rem] font-semibold text-on-background leading-tight mb-8">
              Enhanced Airflow Performance.
            </h2>
            <p className="font-body text-[0.875rem] text-on-surface-variant font-light leading-relaxed mb-12">
              We redesigned the impeller from the ground up, utilizing biometric principles to move larger volumes of air at lower RPMs. The result is a cooling experience that is simultaneously more powerful and whisper-quiet.
            </p>
            <div className="flex flex-wrap gap-4">
              {[
                { icon: 'hexagon', label: 'Honeycomb Pads' },
                { icon: 'air', label: 'High Air Throw' },
                { icon: 'water_drop', label: 'Large 120L Tank' },
              ].map((chip) => (
                <span key={chip.label} className="bg-primary-fixed/80 text-on-primary-fixed rounded-full px-5 py-2.5 text-[0.875rem] font-medium tracking-wide flex items-center gap-2">
                  <span className="material-symbols-outlined text-[1.125rem]">{chip.icon}</span>
                  {chip.label}
                </span>
                ))}
              </div>
            </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-7/12 order-1 md:order-2 relative"
          >
            <img
              alt="Cooling Technology Close-up"
              className="w-full h-[500px] object-cover rounded-[2rem] ambient-shadow-lg"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWqTZmGnrfDfkSDWIWvsiq4cOjVT8N6zAUyAYB2mf-Cfq77gZKLc8WSlTFCaH_Bh7mVhG8LST05rU-I3q8TqNfGHGxErWMaXIEnpAhTipyzZo_aJLsPyP5d0tDN86crjJxDoHxIHlTbrZ6T1DZyC7SZO5mpDBe0Vu6sAwmdB0jqzDiBoL_uDXD6I1Y99oX1KL_1bxoH5CI0Bh_b40HqpFPObb7b-YwdF1xefK1aH71qqdqGObAtHNX8UUx-U1A0YXqW8RkphHtRG8"
            />
          </motion.div>
        </div>
      </section>

      {/* ─── 6. BENTO SPECS ─── */}
      <section className="w-full bg-surface-container-low py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full md:w-1/3 flex flex-col justify-center"
          >
            <h2 className="font-headline text-[2.0rem] font-semibold text-on-background mb-6">What's Inside?</h2>
            <p className="font-body text-[0.875rem] text-on-surface-variant font-light leading-relaxed mb-8">
              Precision engineering meets uncompromising material quality. Every component is designed to operate in perfect harmony, maximizing thermal efficiency.
            </p>
            <button className="self-start text-primary font-medium flex items-center gap-2 hover:opacity-80 transition-opacity">
              View Full Specifications
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </motion.div>
          <div className="w-full md:w-2/3 grid grid-cols-2 gap-4">
            {specs.map((spec, index) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`p-8 rounded-2xl ambient-shadow-sm flex flex-col justify-between aspect-square ${
                  spec.accent
                    ? 'bg-gradient-to-br from-primary to-primary-container text-on-primary'
                    : 'bg-surface-container-lowest'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-4xl font-light ${
                    spec.accent ? 'text-on-primary/80' : 'text-primary'
                  }`}
                >
                  {spec.icon}
                </span>
                <div>
                  <span className={`text-[0.6875rem] font-bold uppercase tracking-widest mb-1 block ${
                    spec.accent ? 'text-on-primary/80' : 'text-on-surface-variant'
                  }`}>
                    {spec.label}
                  </span>
                  <h4 className={`font-headline text-[2rem] font-medium ${
                    spec.accent ? 'text-on-primary' : 'text-on-background'
                  }`}>
                    {spec.value}
                  </h4>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. GLASSMORPHISM TECH ─── */}
      <section className="w-full relative py-40 px-6 md:px-12 flex items-center justify-center overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 z-0"
        >
          <img
            alt="Cold background"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5UJss7CwNAewwLrkdM2nDsy1oIPBoWjLNkNZVrPSUCxD30ECk7vuPBf3qmBOGZn44S62oFAykNY0ThsTdYsuqIJMpIGvv2yFR6XF5QER6rYNReoYMTKaVjoZ2WW3RUHSfWw-hyW3eBNzSYqQ0U-zA2R0Kol5j0Y0qHs1jSdkGbXKyXAV5Eb7IPom9njMb47F8XG-ZbRH2a5tib8AoH9pDHucQbLL1tjeNB5IHXkdpX8rgjMdEmf-Cbr40mRtRM8bDVHmwruoBXVk"
          />
          <div className="absolute inset-0 bg-surface/40 backdrop-blur-sm" />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center"
        >
          <h2 className="font-headline text-[2.0rem] font-semibold text-on-background text-center mb-16 max-w-2xl">
            Scientifically Engineered Cooling.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div className="bg-surface-container-lowest/70 backdrop-blur-2xl rounded-[1.5rem] p-10 ring-1 ring-outline-variant/15 ambient-shadow-lg">
              <span className="material-symbols-outlined text-3xl text-primary mb-6 block">speed</span>
              <h3 className="font-headline text-[1.125rem] font-medium text-on-background mb-4">40% Better Air Delivery</h3>
              <p className="font-body text-[0.875rem] text-on-surface-variant font-light">
                Our aerodynamic louvers and optimized fan blade pitch ensure that cooled air is distributed evenly across wider angles, eliminating warm pockets entirely.
              </p>
            </div>
            <div className="bg-surface-container-lowest/70 backdrop-blur-2xl rounded-[1.5rem] p-10 ring-1 ring-outline-variant/15 ambient-shadow-lg">
              <span className="material-symbols-outlined text-3xl text-primary mb-6 block">eco</span>
              <h3 className="font-headline text-[1.125rem] font-medium text-on-background mb-4">Energy Efficient Motor</h3>
              <p className="font-body text-[0.875rem] text-on-surface-variant font-light">
                Powered by a brushless DC motor that consumes significantly less power while maintaining peak rotational speeds, reducing your carbon footprint.
              </p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── 8. TESTIMONIALS ─── */}
      <section className="w-full bg-surface py-32 px-6 md:px-12 overflow-hidden">
        <div className="max-w-[1920px] mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="font-headline text-[2.0rem] font-semibold text-on-background text-center mb-20"
          >
            Customer Stories.
          </motion.h2>
          <div className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto items-stretch">
            {testimonials.map((t, index) => (
              <motion.div 
                key={t.name} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 1, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 bg-surface-container p-10 rounded-2xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex text-primary mb-6">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    ))}
                  </div>
                  <p className="font-body text-[1.125rem] text-on-background font-light leading-relaxed mb-8">{t.text}</p>
                </div>
                <div>
                  <span className="font-medium text-[0.875rem] block text-on-background">{t.name}</span>
                  <span className="text-[0.6875rem] font-light text-on-surface-variant">{t.product}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 9. STORE LOCATOR ─── */}
      <section className="w-full bg-surface-container-low py-32 px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center flex flex-col items-center"
        >
          <h2 className="font-headline text-[2.0rem] font-semibold text-on-background mb-12">Available Near You.</h2>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
            {cities.map((city) => (
              <span key={city} className="font-headline text-xl text-on-surface-variant hover:text-on-background transition-colors cursor-pointer">
                {city}
              </span>
            ))}
          </div>
          <button className="mt-16 bg-surface-container-highest text-on-surface font-medium py-3 px-8 rounded-xl hover:bg-surface-dim transition-colors">
            Find a Retailer
          </button>
        </motion.div>
      </section>
    </main>
  );
}
