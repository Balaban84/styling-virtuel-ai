
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { SelectField } from './components/SelectField';
import { Button } from './components/Button';
import { ModelParams, GenerationState, Background } from './types';
import { DEFAULT_PARAMS, GENDER_OPTIONS, AGE_OPTIONS, BODY_OPTIONS, SKIN_OPTIONS, POSE_OPTIONS, FIT_OPTIONS, BG_OPTIONS } from './constants';
import { generateTryOnImage, correctGeneratedImage } from './services/geminiService';

export default function App() {
  const [params, setParams] = useState<ModelParams>(DEFAULT_PARAMS);
  const [clothingImage, setClothingImage] = useState<string | null>(null);
  const [genState, setGenState] = useState<GenerationState>({
    isGenerating: false,
    generatedImage: null,
    error: null
  });
  const [correctionText, setCorrectionText] = useState('');

  const updateParam = (key: keyof ModelParams, value: any) => {
    setParams(prev => ({ ...prev, [key]: value }));
  };

  const handleGenerate = async () => {
    if (!clothingImage) {
      setGenState(prev => ({ ...prev, error: "Veuillez d'abord uploader une photo de vêtement." }));
      return;
    }

    setGenState({ isGenerating: true, generatedImage: null, error: null });
    
    try {
      // If "keepSameModel" is false, generate a new seed
      const currentSeed = params.keepSameModel ? params.seed : Math.floor(Math.random() * 1000000);
      if (!params.keepSameModel) {
        updateParam('seed', currentSeed);
      }

      const result = await generateTryOnImage(clothingImage, { ...params, seed: currentSeed });
      setGenState({ isGenerating: false, generatedImage: result, error: null });
    } catch (err: any) {
      setGenState({ isGenerating: false, generatedImage: null, error: err.message });
    }
  };

  const handleCorrection = async () => {
    if (!genState.generatedImage || !correctionText.trim()) return;

    const previousImage = genState.generatedImage;
    setGenState(prev => ({ ...prev, isGenerating: true, error: null }));
    
    try {
      const result = await correctGeneratedImage(previousImage, correctionText);
      setGenState({ isGenerating: false, generatedImage: result, error: null });
      setCorrectionText('');
    } catch (err: any) {
      setGenState(prev => ({ ...prev, isGenerating: false, error: err.message }));
    }
  };

  const handleDownload = () => {
    if (!genState.generatedImage) return;
    const link = document.createElement('a');
    link.href = genState.generatedImage;
    link.download = `styling-virtuel-${Date.now()}.png`;
    link.click();
  };

  const handleClear = () => {
    setGenState({ isGenerating: false, generatedImage: null, error: null });
    setClothingImage(null);
  };

  return (
    <div className="min-h-screen pb-24">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column - Configuration */}
        <div className="lg:col-span-5 space-y-8 animate-fade-in">
          
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">1</span>
              Vêtement
            </h2>
            <ImageUploader 
              onImageSelected={(base64) => {
                setClothingImage(base64);
                setGenState(prev => ({ ...prev, error: null }));
              }} 
              preview={clothingImage} 
            />
          </section>

          <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">2</span>
              Personnalisation
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <SelectField label="Genre" value={params.gender} options={GENDER_OPTIONS} onChange={(v) => updateParam('gender', v)} />
              <SelectField label="Groupe d'âge" value={params.age} options={AGE_OPTIONS} onChange={(v) => updateParam('age', v)} />
              <SelectField label="Morphologie" value={params.bodyType} options={BODY_OPTIONS} onChange={(v) => updateParam('bodyType', v)} />
              <SelectField label="Teint" value={params.skinTone} options={SKIN_OPTIONS} onChange={(v) => updateParam('skinTone', v)} />
              <div className="col-span-2">
                <SelectField label="Pose" value={params.pose} options={POSE_OPTIONS} onChange={(v) => updateParam('pose', v)} />
              </div>
              <div className="col-span-2">
                <SelectField label="Ajustement" value={params.fit} options={FIT_OPTIONS} onChange={(v) => updateParam('fit', v)} />
              </div>
              <div className="col-span-2">
                <SelectField label="Décor / Fond" value={params.background} options={BG_OPTIONS} onChange={(v) => updateParam('background', v)} />
                {params.background === Background.CUSTOM && (
                  <input 
                    type="text"
                    placeholder="Décrivez votre fond idéal..."
                    className="mt-2 w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-black"
                    value={params.customBackground || ''}
                    onChange={(e) => updateParam('customBackground', e.target.value)}
                  />
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <input 
                type="checkbox" 
                id="keepModel"
                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
                checked={params.keepSameModel}
                onChange={(e) => updateParam('keepSameModel', e.target.checked)}
              />
              <label htmlFor="keepModel" className="text-sm font-medium text-gray-700 cursor-pointer">
                Garder le même modèle (Visage/Traits)
              </label>
            </div>
          </section>
        </div>

        {/* Right Column - Results */}
        <div className="lg:col-span-7 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 min-h-[600px] flex flex-col">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm">3</span>
              Rendu Final
            </h2>

            <div className="relative flex-grow bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100 min-h-[500px]">
              {genState.isGenerating ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-black/10 border-t-black rounded-full animate-spin"></div>
                  <p className="text-gray-500 font-medium animate-pulse">L'IA travaille sur votre style...</p>
                </div>
              ) : genState.generatedImage ? (
                <img 
                  src={genState.generatedImage} 
                  alt="Rendu virtuel" 
                  className="w-full h-full object-contain" 
                  loading="lazy"
                />
              ) : genState.error ? (
                <div className="text-center p-8 max-w-sm">
                  <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                  </div>
                  <p className="text-red-600 font-medium">{genState.error}</p>
                  <Button variant="outline" className="mt-4 text-xs py-2 px-4" onClick={handleGenerate}>Réessayer</Button>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 opacity-50">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                    </svg>
                  </div>
                  <p>Configurez vos options et cliquez sur<br/><span className="font-semibold text-gray-600 italic">"Générer l'Essayage"</span></p>
                </div>
              )}
            </div>

            {genState.generatedImage && !genState.isGenerating && (
              <div className="mt-6 space-y-4 animate-fade-in">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Retouches & Corrections</label>
                  <div className="flex gap-2">
                    <textarea 
                      className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-black resize-none h-12 transition-all"
                      placeholder="Ex: 'Change la couleur du pantalon en bleu marine' ou 'Déplace le modèle à droite'..."
                      value={correctionText}
                      onChange={(e) => setCorrectionText(e.target.value)}
                    />
                    <Button 
                      onClick={handleCorrection} 
                      className="px-4 py-2 text-sm"
                      disabled={!correctionText.trim()}
                    >
                      Corriger
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" className="flex-1" onClick={handleClear}>Effacer</Button>
                  <Button variant="outline" className="flex-1" onClick={handleDownload}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                    </svg>
                    Télécharger
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Sticky Action Button */}
      <div className="fixed bottom-0 inset-x-0 p-6 pointer-events-none flex justify-center items-center z-50">
        <Button 
          className="w-full max-w-lg pointer-events-auto h-16 text-lg rounded-2xl shadow-2xl transition-transform active:scale-95"
          onClick={handleGenerate}
          isLoading={genState.isGenerating}
          disabled={!clothingImage}
        >
          {genState.isGenerating ? "Création en cours..." : "Générer l'Essayage"}
        </Button>
      </div>
    </div>
  );
}
