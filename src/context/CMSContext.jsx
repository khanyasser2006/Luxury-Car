import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialCmsData } from '../data/initialCmsData';

const CMSContext = createContext(null);
const LOCAL_STORAGE_KEY = 'veloce_cms_data';

// Security: Deep object sanitization preventing Prototype Pollution (CWE-1321) & Dangerous URI schemes
function sanitizeObject(input) {
  if (input === null || typeof input !== 'object') {
    if (typeof input === 'string') {
      // Disallow dangerous URI schemes if value appears to be a link/URL
      const trimmed = input.trim().toLowerCase();
      if (
        trimmed.startsWith('javascript:') ||
        trimmed.startsWith('vbscript:') ||
        trimmed.startsWith('data:text/html')
      ) {
        return '';
      }
    }
    return input;
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeObject);
  }

  const cleanObj = Object.create(null);
  for (const [key, value] of Object.entries(input)) {
    // Block prototype pollution vectors
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    cleanObj[key] = sanitizeObject(value);
  }
  return { ...cleanObj };
}

export function CMSProvider({ children }) {
  const [cmsData, setCmsData] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const rawParsed = JSON.parse(saved);
        const parsed = sanitizeObject(rawParsed);
        return {
          ...initialCmsData,
          ...parsed,
          heroPhases: Array.isArray(parsed.heroPhases) ? parsed.heroPhases : initialCmsData.heroPhases,
          homePortals: { ...initialCmsData.homePortals, ...(parsed.homePortals || {}) },
          provingGrounds: { ...initialCmsData.provingGrounds, ...(parsed.provingGrounds || {}) },
          fleet: Array.isArray(parsed.fleet) ? parsed.fleet : initialCmsData.fleet,
          engineeringPillars: Array.isArray(parsed.engineeringPillars) ? parsed.engineeringPillars : initialCmsData.engineeringPillars,
          materials: Array.isArray(parsed.materials) ? parsed.materials : initialCmsData.materials,
          testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : initialCmsData.testimonials,
          lapRecords: Array.isArray(parsed.lapRecords) ? parsed.lapRecords : initialCmsData.lapRecords,
          siteMeta: { ...initialCmsData.siteMeta, ...(parsed.siteMeta || {}) },
        };
      }
    } catch (e) {
      console.error('Failed to load CMS data from localStorage:', e);
    }
    return initialCmsData;
  });

  const [changesCount, setChangesCount] = useState(0);
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState(Date.now());

  // Save changes to localStorage whenever cmsData updates
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cmsData));
      setLastSavedTimestamp(Date.now());
    } catch (e) {
      console.error('Failed to persist CMS data to localStorage:', e);
    }
  }, [cmsData]);

  // Generic updater
  const updateCmsData = (updater) => {
    setCmsData((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
    setChangesCount((c) => c + 1);
  };

  // --- HERO PHASES CRUD ---
  const updateHeroPhase = (index, updatedFields) => {
    setCmsData((prev) => {
      const updated = [...prev.heroPhases];
      updated[index] = { ...updated[index], ...updatedFields };
      return { ...prev, heroPhases: updated };
    });
    setChangesCount((c) => c + 1);
  };

  // --- HOME PORTALS CRUD ---
  const updateHomePortals = (updatedFields) => {
    setCmsData((prev) => ({
      ...prev,
      homePortals: { ...prev.homePortals, ...updatedFields },
    }));
    setChangesCount((c) => c + 1);
  };

  const updateHomePortalCard = (cardIndex, updatedCard) => {
    setCmsData((prev) => {
      const newCards = [...prev.homePortals.cards];
      newCards[cardIndex] = { ...newCards[cardIndex], ...updatedCard };
      return {
        ...prev,
        homePortals: { ...prev.homePortals, cards: newCards },
      };
    });
    setChangesCount((c) => c + 1);
  };

  // --- PROVING GROUNDS CRUD ---
  const updateProvingGrounds = (updatedFields) => {
    setCmsData((prev) => ({
      ...prev,
      provingGrounds: { ...prev.provingGrounds, ...updatedFields },
    }));
    setChangesCount((c) => c + 1);
  };

  const updateProvingGroundsSector = (sectorIndex, updatedSector) => {
    setCmsData((prev) => {
      const newSectors = [...prev.provingGrounds.sectors];
      newSectors[sectorIndex] = { ...newSectors[sectorIndex], ...updatedSector };
      return {
        ...prev,
        provingGrounds: { ...prev.provingGrounds, sectors: newSectors },
      };
    });
    setChangesCount((c) => c + 1);
  };

  const updateProvingGroundsStep = (stepIndex, updatedStep) => {
    setCmsData((prev) => {
      const newSteps = [...prev.provingGrounds.protocolSteps];
      newSteps[stepIndex] = { ...newSteps[stepIndex], ...updatedStep };
      return {
        ...prev,
        provingGrounds: { ...prev.provingGrounds, protocolSteps: newSteps },
      };
    });
    setChangesCount((c) => c + 1);
  };

  // --- CARS FLEET CRUD ---
  const addCar = (newCar) => {
    const generatedId = newCar.id || `car-${Date.now()}`;
    const formattedCar = {
      id: generatedId,
      category: newCar.category || 'HYBRID',
      name: newCar.name || 'NEW VELOCE HYPERCAR',
      tagline: newCar.tagline || 'Bespoke High-Performance Special',
      price: newCar.price || '$2,500,000',
      numericPrice: Number(newCar.numericPrice) || 2500000,
      hp: newCar.hp || '1,100 HP',
      accel: newCar.accel || '2.3s (0-100)',
      topSpeed: newCar.topSpeed || '380 KM/H',
      engine: newCar.engine || 'Twin-Turbo Hybrid V8',
      transmission: newCar.transmission || '8-Speed Dual-Clutch',
      weight: newCar.weight || '1,350 KG',
      downforce: newCar.downforce || '650 KG @ 280 km/h',
      unitsLeft: newCar.unitsLeft || '3 Units Available',
      badge: newCar.badge || 'LIMITED ALLOCATION',
      status: newCar.status || 'AVAILABLE',
      imageRef:
        newCar.imageRef ||
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=85',
      description: newCar.description || 'Precision-crafted hypercar tailored for apex circuit dynamics.',
    };

    setCmsData((prev) => ({
      ...prev,
      fleet: [formattedCar, ...prev.fleet],
    }));
    setChangesCount((c) => c + 1);
    return formattedCar;
  };

  const updateCar = (carId, updatedFields) => {
    setCmsData((prev) => ({
      ...prev,
      fleet: prev.fleet.map((car) =>
        car.id === carId ? { ...car, ...updatedFields } : car
      ),
    }));
    setChangesCount((c) => c + 1);
  };

  const deleteCar = (carId) => {
    setCmsData((prev) => ({
      ...prev,
      fleet: prev.fleet.filter((car) => car.id !== carId),
    }));
    setChangesCount((c) => c + 1);
  };

  // --- ENGINEERING PILLARS & MATERIALS CRUD ---
  const addEngineeringPillar = (newPillar) => {
    const formatted = {
      id: newPillar.id || `pillar-${Date.now()}`,
      title: newPillar.title || 'NEW MOTORSPORT INNOVATION',
      subtitle: newPillar.subtitle || 'TECHNICAL ARCHITECTURE',
      spec: newPillar.spec || '50,000 NM/DEG',
      specLabel: newPillar.specLabel || 'MEASUREMENT STANDARD',
      weight: newPillar.weight || 'ULTRA-LIGHTWEIGHT',
      desc: newPillar.desc || 'Aerospace-derived engineering formulation tested at limit.',
      highlights: newPillar.highlights || [
        'Custom lightweight alloy integration',
        'Direct motorsport telemetric calibration',
      ],
      image:
        newPillar.image ||
        'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=85',
    };

    setCmsData((prev) => ({
      ...prev,
      engineeringPillars: [...prev.engineeringPillars, formatted],
    }));
    setChangesCount((c) => c + 1);
    return formatted;
  };

  const updateEngineeringPillar = (pillarId, updatedFields) => {
    setCmsData((prev) => ({
      ...prev,
      engineeringPillars: prev.engineeringPillars.map((p) =>
        p.id === pillarId ? { ...p, ...updatedFields } : p
      ),
    }));
    setChangesCount((c) => c + 1);
  };

  const deleteEngineeringPillar = (pillarId) => {
    setCmsData((prev) => ({
      ...prev,
      engineeringPillars: prev.engineeringPillars.filter((p) => p.id !== pillarId),
    }));
    setChangesCount((c) => c + 1);
  };

  const addMaterial = (newMaterial) => {
    setCmsData((prev) => ({
      ...prev,
      materials: [...prev.materials, newMaterial],
    }));
    setChangesCount((c) => c + 1);
  };

  const updateMaterial = (index, updatedFields) => {
    setCmsData((prev) => {
      const newMats = [...prev.materials];
      newMats[index] = { ...newMats[index], ...updatedFields };
      return { ...prev, materials: newMats };
    });
    setChangesCount((c) => c + 1);
  };

  const deleteMaterial = (index) => {
    setCmsData((prev) => ({
      ...prev,
      materials: prev.materials.filter((_, idx) => idx !== index),
    }));
    setChangesCount((c) => c + 1);
  };

  // --- TESTIMONIALS CRUD ---
  const addTestimonial = (newReview) => {
    const formatted = {
      id: Date.now(),
      quote: newReview.quote || 'An extraordinary hypercar experience on the private circuit.',
      author: newReview.author || 'VIP Client Patron',
      location: newReview.location || 'Monaco & London',
      chassis: newReview.chassis || 'VALKYRIE STRADALE #08/20',
      rating: Number(newReview.rating) || 5,
      deliveryDate: newReview.deliveryDate || 'CURRENT MONTH 2026',
    };

    setCmsData((prev) => ({
      ...prev,
      testimonials: [formatted, ...prev.testimonials],
    }));
    setChangesCount((c) => c + 1);
    return formatted;
  };

  const updateTestimonial = (testimonialId, updatedFields) => {
    setCmsData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t) =>
        t.id === testimonialId ? { ...t, ...updatedFields } : t
      ),
    }));
    setChangesCount((c) => c + 1);
  };

  const deleteTestimonial = (testimonialId) => {
    setCmsData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((t) => t.id !== testimonialId),
    }));
    setChangesCount((c) => c + 1);
  };

  // --- LAP RECORDS CRUD ---
  const addLapRecord = (newRecord) => {
    const formatted = {
      id: Date.now(),
      track: newRecord.track || 'New International Circuit',
      location: newRecord.location || 'European Proving Grounds',
      length: newRecord.length || '5.200 KM',
      time: newRecord.time || '1:45.00',
      car: newRecord.car || 'VALKYRIE STRADALE',
      speed: newRecord.speed || '350 KM/H SPEED TRAP',
      driver: newRecord.driver || 'Factory Chief Test Driver',
    };

    setCmsData((prev) => ({
      ...prev,
      lapRecords: [...prev.lapRecords, formatted],
    }));
    setChangesCount((c) => c + 1);
    return formatted;
  };

  const updateLapRecord = (recordId, updatedFields) => {
    setCmsData((prev) => ({
      ...prev,
      lapRecords: prev.lapRecords.map((r) =>
        r.id === recordId ? { ...r, ...updatedFields } : r
      ),
    }));
    setChangesCount((c) => c + 1);
  };

  const deleteLapRecord = (recordId) => {
    setCmsData((prev) => ({
      ...prev,
      lapRecords: prev.lapRecords.filter((r) => r.id !== recordId),
    }));
    setChangesCount((c) => c + 1);
  };

  // --- SITE META CRUD ---
  const updateSiteMeta = (updatedFields) => {
    setCmsData((prev) => ({
      ...prev,
      siteMeta: { ...prev.siteMeta, ...updatedFields },
    }));
    setChangesCount((c) => c + 1);
  };

  // --- UTILITIES: RESET, EXPORT, IMPORT ---
  const resetToDefaults = () => {
    setCmsData(initialCmsData);
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setChangesCount(0);
  };

  const exportJson = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(cmsData, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `veloce_cms_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importJson = (jsonString) => {
    try {
      const raw = JSON.parse(jsonString);
      if (!raw || typeof raw !== 'object') {
        throw new Error('Invalid JSON root format');
      }
      const sanitized = sanitizeObject(raw);
      setCmsData({
        ...initialCmsData,
        ...sanitized,
        heroPhases: Array.isArray(sanitized.heroPhases) ? sanitized.heroPhases : initialCmsData.heroPhases,
        homePortals: { ...initialCmsData.homePortals, ...(sanitized.homePortals || {}) },
        provingGrounds: { ...initialCmsData.provingGrounds, ...(sanitized.provingGrounds || {}) },
        fleet: Array.isArray(sanitized.fleet) ? sanitized.fleet : initialCmsData.fleet,
        engineeringPillars: Array.isArray(sanitized.engineeringPillars) ? sanitized.engineeringPillars : initialCmsData.engineeringPillars,
        materials: Array.isArray(sanitized.materials) ? sanitized.materials : initialCmsData.materials,
        testimonials: Array.isArray(sanitized.testimonials) ? sanitized.testimonials : initialCmsData.testimonials,
        lapRecords: Array.isArray(sanitized.lapRecords) ? sanitized.lapRecords : initialCmsData.lapRecords,
        siteMeta: { ...initialCmsData.siteMeta, ...(sanitized.siteMeta || {}) },
      });
      setChangesCount((c) => c + 1);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  };

  return (
    <CMSContext.Provider
      value={{
        cmsData,
        changesCount,
        lastSavedTimestamp,
        updateCmsData,
        updateHeroPhase,
        updateHomePortals,
        updateHomePortalCard,
        updateProvingGrounds,
        updateProvingGroundsSector,
        updateProvingGroundsStep,
        addCar,
        updateCar,
        deleteCar,
        addEngineeringPillar,
        updateEngineeringPillar,
        deleteEngineeringPillar,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        addLapRecord,
        updateLapRecord,
        deleteLapRecord,
        updateSiteMeta,
        resetToDefaults,
        exportJson,
        importJson,
      }}
    >
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const context = useContext(CMSContext);
  if (!context) {
    throw new Error('useCMS must be used within a CMSProvider');
  }
  return context;
}
