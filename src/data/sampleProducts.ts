import type { Product, Order, HeroSlide } from '@/types/store';
import nordicSandImg from '@/assets/product-nordic-sand.jpg';
import forestDreamImg from '@/assets/product-forest-dream.jpg';
import autumnGlowImg from '@/assets/product-autumn-glow.jpg';
import blushBloomImg from '@/assets/product-blush-bloom.jpg';
import coastalStripeImg from '@/assets/product-coastal-stripe.jpg';
import midnightGoldImg from '@/assets/product-midnight-gold.jpg';
import heroImg from '@/assets/hero-pillow.jpg';

export const sampleProducts: Product[] = [
  {
    id: '1',
    title: 'Nordic Sand',
    slug: 'nordic-sand',
    description: 'Et smukt pudebetræk i varm sandfarve med subtilt geometrisk mønster. Perfekt til det skandinaviske hjem. Fremstillet i høj kvalitet bomuld med en blød, naturlig tekstur.',
    category: 'Minimalistisk',
    tags: ['sand', 'neutral', 'geometrisk'],
    images: [{ id: '1a', url: nordicSandImg, alt: 'Nordic Sand pudebetræk' }],
    variants: [
      { id: '1v1', name: '45x45 cm', sku: 'NS-45', price: 299, compareAtPrice: 399, inventory: 24, options: { størrelse: '45x45 cm' } },
      { id: '1v2', name: '50x50 cm', sku: 'NS-50', price: 349, compareAtPrice: 449, inventory: 18, options: { størrelse: '50x50 cm' } },
      { id: '1v3', name: '60x60 cm', sku: 'NS-60', price: 399, inventory: 12, options: { størrelse: '60x60 cm' } },
    ],
    status: 'active',
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
  },
  {
    id: '2',
    title: 'Forest Dream',
    slug: 'forest-dream',
    description: 'Elegant pudebetræk i dyb skovgrøn velour med smukke bladbroderier i guld. Bringer naturens ro ind i dit hjem med et luksuriøst udtryk.',
    category: 'Natur',
    tags: ['grøn', 'velour', 'broderi'],
    images: [{ id: '2a', url: forestDreamImg, alt: 'Forest Dream pudebetræk' }],
    variants: [
      { id: '2v1', name: '45x45 cm', sku: 'FD-45', price: 449, inventory: 15, options: { størrelse: '45x45 cm' } },
      { id: '2v2', name: '50x50 cm', sku: 'FD-50', price: 499, inventory: 10, options: { størrelse: '50x50 cm' } },
    ],
    status: 'active',
    createdAt: '2025-01-16T10:00:00Z',
    updatedAt: '2025-01-16T10:00:00Z',
  },
  {
    id: '3',
    title: 'Autumn Glow',
    slug: 'autumn-glow',
    description: 'Livfuldt pudebetræk med abstrakt botanisk print i varme efterårsfarver. Tilføjer et farverigt og legende touch til enhver sofa eller seng.',
    category: 'Botanisk',
    tags: ['orange', 'botanisk', 'farverig'],
    images: [{ id: '3a', url: autumnGlowImg, alt: 'Autumn Glow pudebetræk' }],
    variants: [
      { id: '3v1', name: '45x45 cm', sku: 'AG-45', price: 349, inventory: 20, options: { størrelse: '45x45 cm' } },
      { id: '3v2', name: '50x50 cm', sku: 'AG-50', price: 399, inventory: 14, options: { størrelse: '50x50 cm' } },
    ],
    status: 'active',
    createdAt: '2025-01-17T10:00:00Z',
    updatedAt: '2025-01-17T10:00:00Z',
  },
  {
    id: '4',
    title: 'Blush Bloom',
    slug: 'blush-bloom',
    description: 'Romantisk pudebetræk i blød støvet rosa med delikate akvarelblomster. Et feminint og elegant valg til soveværelset eller loungeområdet.',
    category: 'Blomster',
    tags: ['rosa', 'blomster', 'romantisk'],
    images: [{ id: '4a', url: blushBloomImg, alt: 'Blush Bloom pudebetræk' }],
    variants: [
      { id: '4v1', name: '45x45 cm', sku: 'BB-45', price: 329, inventory: 22, options: { størrelse: '45x45 cm' } },
      { id: '4v2', name: '50x50 cm', sku: 'BB-50', price: 379, compareAtPrice: 429, inventory: 16, options: { størrelse: '50x50 cm' } },
    ],
    status: 'active',
    createdAt: '2025-01-18T10:00:00Z',
    updatedAt: '2025-01-18T10:00:00Z',
  },
  {
    id: '5',
    title: 'Coastal Stripe',
    slug: 'coastal-stripe',
    description: 'Klassisk pudebetræk med maritime striber i creme og navy. Skandinavisk minimalisme møder kystinspiration i dette tidløse design.',
    category: 'Minimalistisk',
    tags: ['striber', 'navy', 'klassisk'],
    images: [{ id: '5a', url: coastalStripeImg, alt: 'Coastal Stripe pudebetræk' }],
    variants: [
      { id: '5v1', name: '45x45 cm', sku: 'CS-45', price: 299, inventory: 30, options: { størrelse: '45x45 cm' } },
      { id: '5v2', name: '50x50 cm', sku: 'CS-50', price: 349, inventory: 25, options: { størrelse: '50x50 cm' } },
      { id: '5v3', name: '30x50 cm', sku: 'CS-3050', price: 249, inventory: 20, options: { størrelse: '30x50 cm' } },
    ],
    status: 'active',
    createdAt: '2025-01-19T10:00:00Z',
    updatedAt: '2025-01-19T10:00:00Z',
  },
  {
    id: '6',
    title: 'Midnight Gold',
    slug: 'midnight-gold',
    description: 'Luksuriøst pudebetræk i dyb koksgrå med art deco-inspirerede guldmønstre. En sofistikeret accent til den stilbevidste indretning.',
    category: 'Luksus',
    tags: ['guld', 'art deco', 'luksus'],
    images: [{ id: '6a', url: midnightGoldImg, alt: 'Midnight Gold pudebetræk' }],
    variants: [
      { id: '6v1', name: '45x45 cm', sku: 'MG-45', price: 549, inventory: 8, options: { størrelse: '45x45 cm' } },
      { id: '6v2', name: '50x50 cm', sku: 'MG-50', price: 599, inventory: 6, options: { størrelse: '50x50 cm' } },
    ],
    status: 'active',
    createdAt: '2025-01-20T10:00:00Z',
    updatedAt: '2025-01-20T10:00:00Z',
  },
];

export const sampleOrders: Order[] = [
  {
    id: 'ord-1',
    orderNumber: '#1001',
    items: [
      { productId: '1', productTitle: 'Nordic Sand', variantName: '45x45 cm', quantity: 2, price: 299, imageUrl: nordicSandImg },
      { productId: '3', productTitle: 'Autumn Glow', variantName: '50x50 cm', quantity: 1, price: 399, imageUrl: autumnGlowImg },
    ],
    customer: { firstName: 'Marie', lastName: 'Jensen', email: 'marie@email.dk', phone: '+45 12345678', address: 'Nørrebrogade 42', city: 'København', zip: '2200', country: 'Danmark' },
    status: 'confirmed',
    total: 997,
    createdAt: '2025-02-01T14:30:00Z',
  },
  {
    id: 'ord-2',
    orderNumber: '#1002',
    items: [
      { productId: '6', productTitle: 'Midnight Gold', variantName: '50x50 cm', quantity: 2, price: 599, imageUrl: midnightGoldImg },
    ],
    customer: { firstName: 'Lars', lastName: 'Andersen', email: 'lars@email.dk', phone: '+45 87654321', address: 'Vestergade 15', city: 'Aarhus', zip: '8000', country: 'Danmark' },
    status: 'shipped',
    total: 1198,
    createdAt: '2025-02-02T09:15:00Z',
  },
  {
    id: 'ord-3',
    orderNumber: '#1003',
    items: [
      { productId: '4', productTitle: 'Blush Bloom', variantName: '45x45 cm', quantity: 3, price: 329, imageUrl: blushBloomImg },
      { productId: '2', productTitle: 'Forest Dream', variantName: '45x45 cm', quantity: 1, price: 449, imageUrl: forestDreamImg },
    ],
    customer: { firstName: 'Sofie', lastName: 'Nielsen', email: 'sofie@email.dk', phone: '+45 11223344', address: 'Algade 8', city: 'Odense', zip: '5000', country: 'Danmark' },
    status: 'pending',
    total: 1436,
    createdAt: '2025-02-03T16:45:00Z',
  },
];

export const sampleHeroSlides: HeroSlide[] = [
  {
    id: 'hero-1',
    title: 'Ny Kollektion 2025',
    subtitle: 'Oplev vores seneste designs i naturlige farver og bløde teksturer',
    buttonText: 'Se kollektion',
    buttonLink: '/produkter',
    imageUrl: heroImg,
    visible: true,
  },
];
