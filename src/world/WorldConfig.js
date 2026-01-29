// WorldConfig.js

export const WorldConfig = {
  roadWidth: 6,
  segmentLength: 20,
  edgeThickness: 0.15, 
  dashLength: 1.5,
  dashGap: 1.2,
  roadColor: 0x00ffff,
  
  shoulderWidth: 3, 
  boundaryColor: 0xA55AFF, 
  
  visibleSegmentsAhead: 10,
  removeDistanceBehind: 100,
  maxTurnAngle: Math.PI / 24, 
  turnChance: { straight: 0.5, left: 0.25 }, 
};