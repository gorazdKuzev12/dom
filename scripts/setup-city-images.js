const fs = require('fs');
const path = require('path');

// List of cities that need map images
const cities = [
  'bitola', 'ohrid', 'kumanovo', 'prilep', 'tetovo', 'veles', 
  'stip', 'gostivar', 'strumica', 'kavadarci', 'gevgelija', 
  'kocani', 'kicevo'
];

// Create the maps folder structure
function setupCityImageFolders() {
  const publicDir = path.join(__dirname, '..', 'public');
  const mapsDir = path.join(publicDir, 'maps');

  // Create maps directory if it doesn't exist
  if (!fs.existsSync(mapsDir)) {
    fs.mkdirSync(mapsDir, { recursive: true });
    console.log('✅ Created maps directory');
  }

  // Create folders for each city
  cities.forEach(city => {
    const cityDir = path.join(mapsDir, city);
    if (!fs.existsSync(cityDir)) {
      fs.mkdirSync(cityDir, { recursive: true });
      console.log(`✅ Created folder for ${city}`);
      
      // Create placeholder files to show what's expected
      createPlaceholderImages(cityDir, city);
    }
  });

  // Create a README file with instructions
  createImageGuide(mapsDir);
}

function createPlaceholderImages(cityDir, city) {
  const placeholderContent = `# Placeholder for ${city} images

This folder should contain:
- standard.png (standard map view of ${city})
- satellite.png (satellite/aerial view of ${city})

Image requirements:
- Format: PNG or JPG
- Recommended size: 800x480px or higher
- Aspect ratio: 16:9 or 5:3

Sources for obtaining city maps:
1. Google Maps screenshots (for personal/development use)
2. OpenStreetMap exports
3. Government mapping agencies
4. Custom designed maps
5. Stock photo websites

Note: Make sure you have proper licensing for any images used in production.
`;

  fs.writeFileSync(path.join(cityDir, 'README.md'), placeholderContent);
}

function createImageGuide(mapsDir) {
  const guideContent = `# City Maps Setup Guide

## Structure
Each city should have its own folder with the following structure:

\`\`\`
maps/
├── bitola/
│   ├── standard.png
│   └── satellite.png
├── ohrid/
│   ├── standard.png
│   └── satellite.png
└── ... (other cities)
\`\`\`

## Required Images per City

### Standard Maps (standard.png)
- Street-level maps showing neighborhoods and landmarks
- Should highlight major roads and districts
- Recommended format: PNG with transparency support
- Size: 800x480px minimum

### Satellite Maps (satellite.png)
- Aerial/satellite view of the city
- Should show geographical features and urban layout
- Format: PNG or high-quality JPG
- Size: 800x480px minimum

## City List
${cities.map(city => `- ${city}`).join('\n')}

## Image Sources

### Free Options:
1. **OpenStreetMap**: https://www.openstreetmap.org/
   - Export custom map tiles
   - Free to use with attribution

2. **USGS Earth Explorer**: https://earthexplorer.usgs.gov/
   - Free satellite imagery
   - Requires account

3. **NASA Worldview**: https://worldview.earthdata.nasa.gov/
   - Free satellite data

### Commercial Options:
1. **Google Maps API**: Static Maps API (requires API key)
2. **Mapbox**: Custom map tiles
3. **HERE Maps**: Static map images

### Development Workaround:
For development purposes, you can:
1. Use the same Skopje images for all cities initially
2. Create simple colored placeholder images
3. Use CSS to generate basic map-like patterns

## Implementation Notes:
- The MapComponent will automatically fallback to Skopje images if city-specific images don't exist
- Make sure image paths are correct relative to the public folder
- Consider image optimization for better performance
- Test with different cities to ensure proper fallback behavior
`;

  fs.writeFileSync(path.join(mapsDir, 'README.md'), guideContent);
  console.log('📝 Created setup guide in maps/README.md');
}

// Run the setup
setupCityImageFolders();

console.log(`
🎉 City image folder structure created!

Next steps:
1. Add actual map images to each city folder
2. Follow the naming convention: standard.png and satellite.png
3. Check the README files for detailed requirements
4. Test the MapComponent with different cities

For development, you can start by copying existing images:
cp public/skopje-maps2.png public/maps/bitola/standard.png
cp public/skopje-maps2.png public/maps/ohrid/standard.png
# ... and so on

This will give you working images while you source proper city-specific maps.
`); 