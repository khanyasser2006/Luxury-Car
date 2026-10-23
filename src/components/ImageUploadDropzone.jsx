import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, Check, RefreshCw, Sparkles, Link as LinkIcon } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export default function ImageUploadDropzone({
  value,
  onChange,
  label = 'HYPERCAR PHOTOMETRY IMAGE',
  aspectRatio = 'video', // 'video' | 'wide' | 'square'
  height = 'h-52',
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [showUrlFallback, setShowUrlFallback] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  // Curated Preset High-Resolution Hypercar Presets for quick selection
  const presets = [
    {
      label: 'Apex Nero Matte Carbon',
      url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=85',
    },
    {
      label: 'Valkyrie Stradale Rosso Corsa',
      url: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=1400&q=85',
    },
    {
      label: 'Phantom Corsa Track Electric',
      url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85',
    },
    {
      label: 'Monza Speedster Open-Top',
      url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1400&q=85',
    },
    {
      label: 'Centurion Aero Streamtail',
      url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1400&q=85',
    },
  ];

  const handleFileProcess = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPG, WEBP, AVIF).');
      return;
    }

    // Limit client-side preview file size if needed, but read as Data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result;
      if (dataUrl && onChange) {
        audioEngine.playTelemetryBeep();
        onChange(dataUrl);
        setPreviewError(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          handleFileProcess(file);
          break;
        }
      }
    }
  };

  return (
    <div className="space-y-3" onPaste={handlePaste}>
      {/* Label & Secondary Controls */}
      <div className="flex items-center justify-between">
        <label className="block font-mono text-xs text-[#98AEA3] uppercase font-bold tracking-wider">
          {label}
        </label>
        <div className="flex items-center space-x-2 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setShowUrlFallback(!showUrlFallback)}
            className="text-[#FA353F] hover:underline inline-flex items-center space-x-1"
          >
            <LinkIcon className="w-3 h-3" />
            <span>{showUrlFallback ? 'Hide URL Input' : 'Paste Image URL'}</span>
          </button>
        </div>
      </div>

      {/* URL Fallback Bar */}
      {showUrlFallback && (
        <div className="flex items-center space-x-2 animate-fadeIn">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="Paste direct HTTPS image link..."
            className="flex-1 p-2.5 rounded bg-[#020F06] border border-[#98AEA3]/20 text-white font-mono text-xs focus:border-[#FA353F] focus:outline-none placeholder-[#526A5E]"
          />
          <button
            type="button"
            onClick={() => {
              if (urlInput.trim() && onChange) {
                audioEngine.playClick();
                onChange(urlInput.trim());
                setUrlInput('');
                setShowUrlFallback(false);
              }
            }}
            className="px-4 py-2.5 rounded bg-[#FA353F] hover:bg-[#FF4A54] text-white font-mono text-xs font-bold uppercase tracking-wider shadow-ruby-glow transition-all"
          >
            APPLY
          </button>
        </div>
      )}

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer overflow-hidden group ${height} flex flex-col items-center justify-center p-4 text-center ${
          isDragging
            ? 'border-[#FA353F] bg-[#FA353F]/15 shadow-ruby-glow scale-[1.01]'
            : value
            ? 'border-[#FA353F]/50 bg-[#020F06] hover:border-[#FA353F]'
            : 'border-[#98AEA3]/25 bg-[#020F06] hover:border-[#FA353F]/60 hover:bg-[#061F10]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {value && !previewError ? (
          <>
            {/* Background Image Preview */}
            <img
              src={value}
              alt="Uploaded Preview"
              onError={() => setPreviewError(true)}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Scrim Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020F06] via-transparent to-[#020F06]/60 opacity-60 group-hover:opacity-80 transition-opacity" />

            {/* Hover Floating Actions */}
            <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center space-y-2">
              <div className="p-3 rounded-full bg-[#FA353F] text-white shadow-ruby-glow">
                <RefreshCw className="w-5 h-5 animate-spin-slow" />
              </div>
              <span className="font-mono text-xs text-white uppercase tracking-widest font-bold bg-[#020F06]/90 px-3.5 py-1.5 rounded-full border border-[#FA353F]/40 shadow-lg">
                DRAG NEW IMAGE OR CLICK TO REPLACE
              </span>
            </div>

            {/* Quick Remove Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                audioEngine.playClick();
                if (onChange) onChange('');
              }}
              className="absolute top-3 right-3 z-20 p-2 rounded-full bg-[#020F06]/85 hover:bg-[#FA353F] text-white transition-colors border border-[#98AEA3]/30"
              title="Remove Image"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="space-y-3 pointer-events-none">
            <div className="w-14 h-14 mx-auto rounded-full bg-[#061F10] border border-[#FA353F]/40 flex items-center justify-center text-[#FA353F] group-hover:scale-110 group-hover:border-[#FA353F] group-hover:shadow-ruby-glow transition-all">
              <Upload className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <p className="font-display font-bold text-sm uppercase text-white tracking-wide">
                DRAG &amp; DROP IMAGE HERE
              </p>
              <p className="font-sans text-xs text-[#98AEA3]">
                or <span className="text-[#FA353F] underline font-bold">browse local files</span> from your device
              </p>
            </div>

            <span className="inline-block font-mono text-[10px] text-[#526A5E] uppercase tracking-widest bg-[#061F10] px-3 py-1 rounded-full border border-[#98AEA3]/10">
              SUPPORTS PNG, JPG, WEBP, AVIF (PASTE FROM CLIPBOARD SUPPORTED)
            </span>
          </div>
        )}
      </div>

      {/* Preset Hypercar Quick Pickers */}
      <div className="space-y-1.5 pt-1">
        <span className="font-mono text-[10px] text-[#7E9389] uppercase tracking-wider block font-bold">
          OR QUICK-PICK FROM ATELIER PRESETS:
        </span>
        <div className="flex flex-wrap gap-2">
          {presets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                audioEngine.playClick();
                if (onChange) {
                  onChange(p.url);
                  setPreviewError(false);
                }
              }}
              className={`px-3 py-1 rounded-md font-mono text-[10px] font-bold uppercase transition-all flex items-center space-x-1.5 border ${
                value === p.url
                  ? 'bg-[#FA353F] text-white border-[#FA353F] shadow-ruby-glow'
                  : 'bg-[#061F10] hover:bg-[#0A2E19] text-[#98AEA3] hover:text-white border-[#98AEA3]/20'
              }`}
            >
              <Sparkles className="w-3 h-3 text-[#FA353F]" />
              <span>{p.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
