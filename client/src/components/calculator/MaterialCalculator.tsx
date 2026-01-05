import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Box, Layers, Circle, Square, Calculator } from 'lucide-react';

// Attached assets from the user
import perfilUImg from '@assets/perfil-u-aco_1767619535734.jpg';
import perfilTImg from '@assets/perfil-t-aco_1767619541064.jpg';
import perfilLImg from '@assets/perfil-l-aco_1767619546640.jpg';
import tuboRetangularImg from '@assets/tubo-retangular-aco_1767619555334.jpg';
import tuboQuadradoImg from '@assets/tubo-quadrado-aco_1767619561855.jpg';
import tuboRedondoImg from '@assets/tubo-redondo-aco_1767619566782.jpg';
import barraSextavadaImg from '@assets/barra-sextavada-aco_1767619571934.jpg';
import barraRedondaImg from '@assets/barra-redonda-aco_1767619576790.jpg';
import chapaImg from '@assets/chapa-aco_1767619581390.jpg';
import bobinaImg from '@assets/bobina-aco_1767619586862.jpg';
import barraRetangularImg from '@assets/barra-retangular-aco_1767619592022.jpg';
import barraQuadradaImg from '@assets/barra-quadrada-aco_1767619596638.jpg';

const DENSITIES: Record<string, number> = {
  'AÇO CARBONO': 7.85,
  'AÇO INOX': 8.0,
  'ALUMÍNIO': 2.7,
  'COBRE': 8.96,
  'LATÃO': 8.5,
  'BRONZE': 8.8,
};

type Shape = 
  | 'BARRA QUADRADA' 
  | 'BARRA RETANGULAR' 
  | 'BOBINA'
  | 'CHAPA' 
  | 'BARRA REDONDA' 
  | 'BARRA SEXTAVADA'
  | 'TUBO REDONDO' 
  | 'TUBO QUADRADO' 
  | 'TUBO RETANGULAR'
  | 'PERFIL L'
  | 'PERFIL T'
  | 'PERFIL U';

const SHAPE_IMAGES: Record<Shape, string> = {
  'BARRA QUADRADA': barraQuadradaImg,
  'BARRA RETANGULAR': barraRetangularImg,
  'BOBINA': bobinaImg,
  'CHAPA': chapaImg,
  'BARRA REDONDA': barraRedondaImg,
  'BARRA SEXTAVADA': barraSextavadaImg,
  'TUBO REDONDO': tuboRedondoImg,
  'TUBO QUADRADO': tuboQuadradoImg,
  'TUBO RETANGULAR': tuboRetangularImg,
  'PERFIL L': perfilLImg,
  'PERFIL T': perfilTImg,
  'PERFIL U': perfilUImg,
};

export function MaterialCalculator() {
  const [material, setMaterial] = useState('AÇO CARBONO');
  const [shape, setShape] = useState<Shape>('BARRA QUADRADA');
  const [dimensions, setDimensions] = useState<Record<string, number>>({
    A: 0,
    L: 0,
    L1: 0,
    L2: 0,
    C: 0,
    D: 0,
    E: 0,
  });
  const [weight, setWeight] = useState(0);

  const calculateWeight = (currentDims?: Record<string, number>, currentShape?: Shape, currentMaterial?: string) => {
    const activeMaterial = currentMaterial || material;
    const activeShape = currentShape || shape;
    const activeDims = currentDims || dimensions;
    
    const density = DENSITIES[activeMaterial];
    let volumeCm3 = 0;

    const { A, L, L1, L2, C, D, E } = activeDims;
    const mmToCm = (val: number) => val / 10;

    switch (activeShape) {
      case 'BARRA QUADRADA':
        volumeCm3 = mmToCm(A) * mmToCm(A) * mmToCm(C);
        break;
      case 'BARRA RETANGULAR':
        volumeCm3 = mmToCm(L) * mmToCm(E) * mmToCm(C);
        break;
      case 'BOBINA':
      case 'CHAPA':
        volumeCm3 = mmToCm(L) * mmToCm(E) * mmToCm(C);
        break;
      case 'BARRA REDONDA':
        const radiusCm = mmToCm(D) / 2;
        volumeCm3 = Math.PI * Math.pow(radiusCm, 2) * mmToCm(C);
        break;
      case 'BARRA SEXTAVADA':
        const sideCm = mmToCm(A) / Math.sqrt(3);
        volumeCm3 = ((3 * Math.sqrt(3)) / 2) * Math.pow(sideCm, 2) * mmToCm(C);
        break;
      case 'TUBO REDONDO':
        const outerRCm = mmToCm(D) / 2;
        const innerRCm = outerRCm - mmToCm(E);
        volumeCm3 = Math.PI * (Math.pow(outerRCm, 2) - Math.pow(innerRCm, 2)) * mmToCm(C);
        break;
      case 'TUBO QUADRADO':
        const outerAreaQ = Math.pow(mmToCm(L), 2);
        const innerAreaQ = Math.pow(mmToCm(L) - (2 * mmToCm(E)), 2);
        volumeCm3 = (outerAreaQ - innerAreaQ) * mmToCm(C);
        break;
      case 'TUBO RETANGULAR':
        const outerAreaR = mmToCm(L1) * mmToCm(L2);
        const innerAreaR = (mmToCm(L1) - 2 * mmToCm(E)) * (mmToCm(L2) - 2 * mmToCm(E));
        volumeCm3 = (outerAreaR - innerAreaR) * mmToCm(C);
        break;
      case 'PERFIL L':
        volumeCm3 = (mmToCm(L) * mmToCm(E) + (mmToCm(L) - mmToCm(E)) * mmToCm(E)) * mmToCm(C);
        break;
      case 'PERFIL T':
        volumeCm3 = (mmToCm(L) * mmToCm(E) + (mmToCm(L) - mmToCm(E)) * mmToCm(E)) * mmToCm(C);
        break;
      case 'PERFIL U':
        volumeCm3 = (mmToCm(L) * mmToCm(E) + 2 * (mmToCm(L) - mmToCm(E)) * mmToCm(E)) * mmToCm(C);
        break;
    }

    const weightKg = (volumeCm3 * density) / 1000;
    setWeight(weightKg);
  };

  const handleInputChange = (field: string, value: string) => {
    const rawValue = value.replace(',', '.');
    const numValue = rawValue === "" ? 0 : parseFloat(rawValue);
    
    setDimensions(prev => {
      const newDims = { ...prev, [field]: numValue };
      // Force calculation on state change
      calculateWeight(newDims, shape, material);
      return newDims;
    });
  };

  const handleShapeChange = (newShape: Shape) => {
    setShape(newShape);
    setWeight(0);
    setDimensions(prev => {
      const resetDims = { ...prev };
      Object.keys(resetDims).forEach(key => {
        if (key !== 'C') resetDims[key] = 0;
      });
      calculateWeight(resetDims, newShape, material);
      return resetDims;
    });
  };

  const formatWeight = (w: number) => {
    if (w === 0 || isNaN(w)) return "0";
    if (w < 0.0001) return w.toFixed(8).replace('.', ',');
    if (w < 0.001) return w.toFixed(6).replace('.', ',');
    return w.toLocaleString('pt-BR', { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  };

  return (
    <Card className="p-8 bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-premium border border-white">
      <h2 className="text-2xl font-black text-foreground mb-8 text-center uppercase tracking-tight">Cálculo de Peso de Metais</h2>
      
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {Object.keys(DENSITIES).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => {
              setMaterial(m);
              calculateWeight(dimensions, shape, m);
            }}
            className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all ${
              material === m ? 'bg-primary text-white shadow-lg scale-105' : 'bg-gray-100 text-muted-foreground hover:bg-gray-200'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-12 gap-2 mb-10">
        {(Object.keys(SHAPE_IMAGES) as Shape[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleShapeChange(s)}
            className={`flex flex-col items-center gap-2 p-2 rounded-xl transition-all border ${
              shape === s ? 'bg-primary/10 text-primary border-primary/20 scale-105 shadow-sm' : 'text-muted-foreground hover:bg-gray-50 border-transparent'
            }`}
          >
            <img src={SHAPE_IMAGES[s]} className="w-8 h-8 object-contain mix-blend-multiply" alt={s} />
            <span className="text-[7px] font-black uppercase text-center leading-tight">{s}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <div className="space-y-6">
            {shape === 'BARRA QUADRADA' && (
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary">A (mm)</Label>
                <Input 
                  type="text" 
                  inputMode="decimal"
                  value={dimensions.A || ''}
                  onChange={(e) => handleInputChange('A', e.target.value)} 
                  className="rounded-xl border-gray-200" 
                  placeholder="0" 
                />
              </div>
            )}
            {(shape === 'BARRA RETANGULAR' || shape === 'BOBINA' || shape === 'CHAPA' || shape === 'TUBO QUADRADO' || shape === 'PERFIL L' || shape === 'PERFIL T' || shape === 'PERFIL U') && (
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary">L (mm)</Label>
                <Input 
                  type="text" 
                  inputMode="decimal"
                  value={dimensions.L || ''}
                  onChange={(e) => handleInputChange('L', e.target.value)} 
                  className="rounded-xl border-gray-200" 
                  placeholder="0" 
                />
              </div>
            )}
            {shape === 'TUBO RETANGULAR' && (
              <>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary">L1 (mm)</Label>
                  <Input 
                    type="text" 
                    inputMode="decimal"
                    value={dimensions.L1 || ''}
                    onChange={(e) => handleInputChange('L1', e.target.value)} 
                    className="rounded-xl border-gray-200" 
                    placeholder="0" 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary">L2 (mm)</Label>
                  <Input 
                    type="text" 
                    inputMode="decimal"
                    value={dimensions.L2 || ''}
                    onChange={(e) => handleInputChange('L2', e.target.value)} 
                    className="rounded-xl border-gray-200" 
                    placeholder="0" 
                  />
                </div>
              </>
            )}
            {(shape === 'BARRA REDONDA' || shape === 'TUBO REDONDO') && (
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary">D (mm)</Label>
                <Input 
                  type="text" 
                  inputMode="decimal"
                  value={dimensions.D || ''}
                  onChange={(e) => handleInputChange('D', e.target.value)} 
                  className="rounded-xl border-gray-200" 
                  placeholder="0" 
                />
              </div>
            )}
            {shape === 'BARRA SEXTAVADA' && (
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary">A (mm)</Label>
                <Input 
                  type="text" 
                  inputMode="decimal"
                  value={dimensions.A || ''}
                  onChange={(e) => handleInputChange('A', e.target.value)} 
                  className="rounded-xl border-gray-200" 
                  placeholder="0" 
                />
              </div>
            )}
            {(shape === 'BARRA RETANGULAR' || shape === 'BOBINA' || shape === 'CHAPA' || shape === 'TUBO REDONDO' || shape === 'TUBO QUADRADO' || shape === 'TUBO RETANGULAR' || shape === 'PERFIL L' || shape === 'PERFIL T' || shape === 'PERFIL U') && (
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-primary">E (mm)</Label>
                <Input 
                  type="text" 
                  inputMode="decimal"
                  value={dimensions.E || ''}
                  onChange={(e) => handleInputChange('E', e.target.value)} 
                  className="rounded-xl border-gray-200" 
                  placeholder="0" 
                />
              </div>
            )}
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-primary">C - Comprimento (mm)</Label>
              <Input 
                type="text" 
                inputMode="decimal"
                value={dimensions.C || ''}
                onChange={(e) => handleInputChange('C', e.target.value)} 
                className="rounded-xl border-gray-200" 
                placeholder="0" 
              />
            </div>

            <Button 
              type="button"
              onClick={() => calculateWeight()}
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
            >
              <Calculator className="w-5 h-5" />
              Calcular Peso
            </Button>
          </div>

          <div className="pt-6 border-t border-gray-100">
             <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Peso por peça</Label>
             <div className="mt-2 p-4 bg-primary/5 rounded-2xl border border-primary/10 text-3xl font-black text-primary text-center">
               {formatWeight(weight)} kg
             </div>
          </div>
        </div>

        <div className="aspect-square bg-white rounded-[2rem] border border-gray-100 shadow-inner flex flex-col items-center justify-center p-4 overflow-hidden relative">
           <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
           
           <img 
             src={SHAPE_IMAGES[shape]} 
             alt={shape} 
             className="w-full h-full object-contain relative z-10" 
           />
           
           <p className="mt-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest relative z-10">{shape}</p>
        </div>
      </div>
    </Card>
  );
}
