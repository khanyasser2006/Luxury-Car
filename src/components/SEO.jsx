import React, { useEffect } from 'react';
import { useCMS } from '../context/CMSContext';

export default function SEO({ currentView = 'home' }) {
  const { cmsData } = useCMS();
  const brandName = cmsData?.siteMeta?.brandName || 'VELOCE';
  const fleet = cmsData?.fleet || [];
  const testimonials = cmsData?.testimonials || [];

  useEffect(() => {
    // 1. Dynamic Titles & Descriptions Mapping
    const seoMap = {
      home: {
        title: `${brandName} ATELIER | Bespoke Hypercars, Motorsport Engineering & Private Proving Grounds`,
        desc: `Experience ${brandName} Atelier: Handcrafted limited-edition hypercars, 11,100 RPM V12 powertrains, 42,500 Nm/deg carbon monocoques, and private 5.4 km racetrack shakedowns.`,
        path: '',
        image: fleet[0]?.imageRef || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=85',
      },
      cars: {
        title: `Hypercar Shop & Fleet Models | ${brandName} Atelier Official Showroom`,
        desc: `Browse available ${brandName} hypercars including the Apex Nero GT, Valkyrie Stradale V12, and Phantom Corsa. Configure custom finishes, forged wheels, and order direct allocations.`,
        path: '#/cars',
        image: fleet[1]?.imageRef || fleet[0]?.imageRef || 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1400&q=85',
      },
      engineering: {
        title: `Motorsport Architecture & Carbon Engineering | ${brandName} Masterclass`,
        desc: `Deep dive into aerospace-grade engineering: 42,500 Nm/deg carbon monocoques, naturally aspirated 11,100 RPM V12 engines, and active aerodynamic ground-effect systems.`,
        path: '#/engineering',
        image: cmsData?.engineeringPillars?.[0]?.image || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1400&q=85',
      },
      reviews: {
        title: `Verified Client Reviews & Circuit Lap Records | ${brandName} Drivers Circle`,
        desc: `Read unfiltered testimonials from verified ${brandName} hypercar owners, official private proving grounds lap records, and critical acclaim from global motorsport press.`,
        path: '#/reviews',
        image: fleet[2]?.imageRef || fleet[0]?.imageRef || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85',
      },
      auth: {
        title: `VIP Client Portal & Chassis Allocation | ${brandName} Atelier Access`,
        desc: `Client authentication and chassis reservation portal for ${brandName} owners. Manage your bespoke build progress and private track day appointments.`,
        path: '#/auth',
        image: fleet[0]?.imageRef || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=85',
      },
      admin: {
        title: `CMS Control Studio | ${brandName} Platform Engine`,
        desc: `Official Content Management System for ${brandName} Atelier: Real-time CRUD for hypercars, hero sequences, engineering pillars, and site metadata.`,
        path: '#/admin',
        image: fleet[0]?.imageRef || 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=85',
      },
    };

    const currentSeo = seoMap[currentView] || seoMap.home;
    const fullCanonicalUrl = `https://veloce-motors.com/${currentSeo.path}`;

    // Update Document Title
    document.title = currentSeo.title;

    // Helper to safely set meta attribute
    const setMetaTag = (selector, attr, value) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (selector.startsWith('meta[name=')) {
          const nameMatch = selector.match(/meta\[name=['"]([^'"]+)['"]\]/);
          if (nameMatch && nameMatch[1]) el.setAttribute('name', nameMatch[1]);
        } else if (selector.startsWith('meta[property=')) {
          const propMatch = selector.match(/meta\[property=['"]([^'"]+)['"]\]/);
          if (propMatch && propMatch[1]) el.setAttribute('property', propMatch[1]);
        }
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    // Update Meta Description & Title & Robots
    setMetaTag('meta[name="description"]', 'content', currentSeo.desc);
    setMetaTag('meta[name="title"]', 'content', currentSeo.title);
    setMetaTag(
      'meta[name="robots"]',
      'content',
      currentView === 'admin'
        ? 'noindex, nofollow, noarchive'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
    );

    // Update Open Graph Tags
    setMetaTag('meta[property="og:title"]', 'content', currentSeo.title);
    setMetaTag('meta[property="og:description"]', 'content', currentSeo.desc);
    setMetaTag('meta[property="og:url"]', 'content', fullCanonicalUrl);
    setMetaTag('meta[property="og:image"]', 'content', currentSeo.image);

    // Update Twitter Cards
    setMetaTag('meta[name="twitter:title"]', 'content', currentSeo.title);
    setMetaTag('meta[name="twitter:description"]', 'content', currentSeo.desc);
    setMetaTag('meta[name="twitter:image"]', 'content', currentSeo.image);

    // Update Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', fullCanonicalUrl);

    // 2. Dynamic JSON-LD Structured Data Injection
    const schemaScriptId = 'dynamic-veloce-jsonld';
    let scriptEl = document.getElementById(schemaScriptId);
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = schemaScriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    // Generate Breadcrumb Schema
    const breadcrumbSchema = {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://veloce-motors.com/',
        },
        ...(currentView !== 'home'
          ? [
              {
                '@type': 'ListItem',
                position: 2,
                name: currentView.toUpperCase(),
                item: fullCanonicalUrl,
              },
            ]
          : []),
      ],
    };

    // Generate Fleet Car / Vehicle Schemas
    const carListSchema = {
      '@type': 'ItemList',
      itemListElement: fleet.map((car, index) => ({
        '@type': 'Car',
        position: index + 1,
        name: car.name,
        description: car.description,
        image: car.imageRef,
        vehicleEngine: {
          '@type': 'EngineSpecification',
          name: car.engine,
          enginePower: {
            '@type': 'QuantitativeValue',
            value: car.hp,
          },
        },
        vehicleTransmission: car.transmission,
        vehicleConfiguration: car.category,
        offers: {
          '@type': 'Offer',
          price: car.numericPrice || 2500000,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: 'https://veloce-motors.com/#/cars',
        },
      })),
    };

    // Generate Reviews Schema
    const reviewsSchema = {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: String(testimonials.length || 65),
      bestRating: '5',
      worstRating: '1',
    };

    const dynamicGraph = {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumbSchema,
        carListSchema,
        ...(currentView === 'reviews' ? [reviewsSchema] : []),
      ],
    };

    scriptEl.textContent = JSON.stringify(dynamicGraph);
  }, [currentView, brandName, fleet, testimonials]);

  return null;
}
