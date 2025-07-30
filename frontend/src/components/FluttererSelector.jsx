import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Star, Zap, Shield, Gauge, Heart, ShoppingCart, Lock } from 'lucide-react';
import { FLUTTERERS, RARITY_TIERS, RARITY_COLORS, RARITY_PRICES, STARTER_PACK, getFlutterersByRarity } from '../data/flutterers';

const FluttererSelector = ({ selectedFlutterer, onSelectFlutterer, gameStats, onPurchase }) => {
  const [selectedTab, setSelectedTab] = useState('collection');
  const [previewFlutterer, setPreviewFlutterer] = useState(null);

  const renderFluttererCard = (flutterer) => {
    const isSelected = selectedFlutterer?.id === flutterer.id;
    const rarityColor = RARITY_COLORS[flutterer.rarity];
    const canUnlock = checkUnlockCondition(flutterer, gameStats);

    return (
      <Card 
        key={flutterer.id}
        className={`relative cursor-pointer transition-all duration-300 hover:scale-105 ${
          isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
        } ${!flutterer.unlocked ? 'opacity-60' : ''}`}
        style={{ borderColor: rarityColor }}
        onClick={() => flutterer.unlocked && onSelectFlutterer(flutterer)}
      >
        <CardHeader className="p-3">
          <div className="flex justify-between items-start">
            <Badge 
              variant="outline" 
              className="text-xs font-bold"
              style={{ color: rarityColor, borderColor: rarityColor }}
            >
              {flutterer.rarity.toUpperCase()}
            </Badge>
            {!flutterer.unlocked && <Lock className="w-4 h-4 text-gray-500" />}
          </div>
          <CardTitle className="text-sm">{flutterer.name}</CardTitle>
        </CardHeader>
        
        <CardContent className="p-3 pt-0">
          {/* Flutterer Preview */}
          <div className="w-full h-24 flex items-center justify-center mb-3 bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden">
            <FluttererPreview flutterer={flutterer} size={1.2} />
          </div>
          
          <p className="text-xs text-gray-600 mb-3">{flutterer.description}</p>
          
          {/* Skills Display */}
          <div className="space-y-1 mb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <Gauge className="w-3 h-3" />
                Speed
              </span>
              <span className="font-bold">{flutterer.skills.speed}x</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-1">
                <Heart className="w-3 h-3" />
                Health
              </span>
              <span className="font-bold">{flutterer.skills.health}</span>
            </div>
            {flutterer.skills.special && (
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Special
                </span>
                <Badge variant="secondary" className="text-xs">
                  {flutterer.skills.special.replace('_', ' ')}
                </Badge>
              </div>
            )}
          </div>
          
          {/* Action Button */}
          {!flutterer.unlocked && (
            <div className="space-y-2">
              {flutterer.unlockCondition.includes('purchase') ? (
                <Button 
                  size="sm" 
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPurchase(flutterer);
                  }}
                >
                  <ShoppingCart className="w-3 h-3 mr-1" />
                  ${RARITY_PRICES[flutterer.rarity]}
                </Button>
              ) : (
                <div className="text-xs text-center text-gray-500">
                  {getUnlockConditionText(flutterer.unlockCondition)}
                </div>
              )}
            </div>
          )}
          
          {isSelected && (
            <Badge className="absolute -top-2 -right-2 bg-blue-500">
              SELECTED
            </Badge>
          )}
        </CardContent>
      </Card>
    );
  };

  const getUnlockConditionText = (condition) => {
    const conditionMap = {
      'score_5000': 'Score 5,000 points',
      'score_25000': 'Score 25,000 points', 
      'level_5': 'Reach Level 5',
      'level_10': 'Reach Level 10',
      'defeat_100_enemies': 'Defeat 100 enemies',
      'survive_300_seconds': 'Survive 5 minutes',
      'defeat_boss_3_times': 'Defeat boss 3 times',
      'complete_all_levels': 'Complete all levels'
    };
    return conditionMap[condition] || 'Complete challenge';
  };

  const checkUnlockCondition = (flutterer, stats) => {
    if (!stats) return false;
    const condition = flutterer.unlockCondition;
    
    switch (condition) {
      case 'score_5000': return stats.highScore >= 5000;
      case 'score_25000': return stats.highScore >= 25000;
      case 'level_5': return stats.maxLevel >= 5;
      case 'level_10': return stats.maxLevel >= 10;
      case 'defeat_100_enemies': return stats.enemiesDefeated >= 100;
      case 'survive_300_seconds': return stats.totalSurvivalTime >= 300;
      case 'defeat_boss_3_times': return stats.bossDefeats >= 3;
      case 'complete_all_levels': return stats.maxLevel >= 15;
      default: return false;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-purple-600/20 border-purple-400 text-white hover:bg-purple-600/40">
          <Star className="w-4 h-4 mr-2" />
          Select Flutterer
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-900 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            <span className="text-pink-300">Butterfly</span>{' '}
            <span className="text-cyan-300">Collection</span>
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800">
            <TabsTrigger value="collection">My Collection</TabsTrigger>
            <TabsTrigger value="shop">Flutterer Shop</TabsTrigger>
          </TabsList>
          
          <TabsContent value="collection" className="space-y-4">
            <div className="text-center text-sm text-gray-400 mb-4">
              Select your butterfly flutterer for battle
            </div>
            
            {/* Currently Selected */}
            {selectedFlutterer && (
              <Card className="bg-blue-900/30 border-blue-500">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-blue-300">Currently Selected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 flex items-center justify-center bg-slate-800 rounded-lg">
                      <FluttererPreview flutterer={selectedFlutterer} size={1} />
                    </div>
                    <div>
                      <h3 className="font-bold">{selectedFlutterer.name}</h3>
                      <Badge 
                        variant="outline" 
                        style={{ color: RARITY_COLORS[selectedFlutterer.rarity] }}
                      >
                        {selectedFlutterer.rarity}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {/* Rarity Sections */}
            {Object.values(RARITY_TIERS).map(rarity => (
              <div key={rarity}>
                <h3 className="text-lg font-bold mb-3 capitalize" style={{ color: RARITY_COLORS[rarity] }}>
                  {rarity} Flutterers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {getFlutterersByRarity(rarity).map(renderFluttererCard)}
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="shop" className="space-y-4">
            <div className="text-center text-sm text-gray-400 mb-4">
              Purchase premium flutterers and starter packs
            </div>
            
            {/* Starter Pack */}
            <Card className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 border-yellow-500">
              <CardHeader>
                <CardTitle className="text-yellow-300">🎁 {STARTER_PACK.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-300 mb-3">{STARTER_PACK.description}</p>
                <div className="space-y-2 mb-4">
                  <div>✨ Epic Blaster Wing Flutterer</div>
                  <div>🪙 1,000 Cosmic Coins</div>
                  <div>⚡ 5 Power-Up Bundle</div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
                  onClick={() => onPurchase(STARTER_PACK)}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy for ${STARTER_PACK.price}
                </Button>
              </CardContent>
            </Card>
            
            {/* Premium Flutterers */}
            <div className="space-y-4">
              {FLUTTERERS.filter(f => f.unlockCondition.includes('purchase')).map(renderFluttererCard)}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Component to render butterfly preview
const FluttererPreview = ({ flutterer, size = 1 }) => {
  const colors = flutterer.colors;
  const scale = size;
  
  return (
    <div 
      className="relative"
      style={{ transform: `scale(${scale})` }}
    >
      {/* Glow effect for legendary */}
      {flutterer.rarity === RARITY_TIERS.LEGENDARY && colors.glow && (
        <div 
          className="absolute inset-0 rounded-full blur-md opacity-50"
          style={{ backgroundColor: colors.glow }}
        />
      )}
      
      {/* Butterfly Body */}
      <div 
        className="w-1 h-8 mx-auto rounded-full"
        style={{ backgroundColor: colors.body }}
      />
      
      {/* Wings */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
        {/* Upper Wings */}
        <div className="flex gap-1">
          <div 
            className="w-6 h-8 rounded-full opacity-80"
            style={{ backgroundColor: colors.wing1 }}
          />
          <div 
            className="w-6 h-8 rounded-full opacity-80"
            style={{ backgroundColor: colors.wing1 }}
          />
        </div>
        
        {/* Lower Wings */}
        <div className="flex gap-1 mt-1">
          <div 
            className="w-4 h-6 rounded-full opacity-70"
            style={{ backgroundColor: colors.wing2 }}
          />
          <div 
            className="w-4 h-6 rounded-full opacity-70"
            style={{ backgroundColor: colors.wing2 }}
          />
        </div>
        
        {/* Wing Patterns */}
        <div className="absolute top-1 left-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colors.accent }}
          />
        </div>
        <div className="absolute top-1 right-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: colors.accent }}
          />
        </div>
      </div>
      
      {/* Special Effects */}
      {flutterer.skills.special === 'trail_sparkles' && (
        <div className="absolute -top-1 -left-1 w-8 h-8 opacity-30">
          <div className="animate-pulse bg-yellow-300 w-1 h-1 rounded-full absolute top-0 left-2" />
          <div className="animate-pulse bg-yellow-300 w-1 h-1 rounded-full absolute top-2 left-0" />
          <div className="animate-pulse bg-yellow-300 w-1 h-1 rounded-full absolute top-3 left-3" />
        </div>
      )}
    </div>
  );
};

export default FluttererSelector;