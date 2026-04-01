// Approximate center coordinates for Dutch 2-digit postcode prefixes
// Source: derived from Dutch postcode area boundaries
export const postcodeCoords: Record<string, [number, number]> = {
  '10': [52.374, 4.890],  // Amsterdam
  '11': [52.350, 4.870],  // Amsterdam-Zuid
  '12': [52.330, 4.770],  // Haarlem-Zuid
  '13': [52.350, 5.220],  // Almere
  '14': [52.520, 4.720],  // Heerhugowaard
  '15': [52.640, 5.060],  // Hoorn
  '16': [52.700, 5.080],  // Enkhuizen
  '17': [52.530, 5.040],  // Purmerend
  '18': [52.630, 4.750],  // Alkmaar
  '19': [52.460, 4.640],  // Haarlem-Noord
  '20': [52.380, 4.640],  // Haarlem
  '21': [52.160, 4.490],  // Leiden
  '22': [52.070, 4.300],  // Den Haag
  '23': [52.060, 4.280],  // Den Haag
  '24': [52.010, 4.350],  // Rijswijk/Delft
  '25': [52.000, 4.370],  // Den Haag-Zuid
  '26': [51.920, 4.480],  // Rotterdam
  '27': [51.890, 4.530],  // Capelle/Krimpen
  '28': [51.810, 4.680],  // Dordrecht
  '29': [51.920, 4.400],  // Rotterdam-West
  '30': [51.980, 4.490],  // Rotterdam-Noord
  '31': [51.920, 4.600],  // Ridderkerk/Barendrecht
  '32': [52.000, 4.710],  // Gouda
  '33': [51.950, 5.100],  // Gorinchem
  '34': [52.090, 5.120],  // Utrecht
  '35': [52.080, 5.100],  // Utrecht
  '36': [52.160, 5.390],  // Amersfoort
  '37': [52.220, 5.180],  // Baarn/Soest
  '38': [52.200, 5.300],  // Amersfoort-Noord
  '39': [52.060, 5.650],  // Veenendaal
  '40': [51.810, 5.100],  // Waalwijk
  '41': [51.700, 5.050],  // Tilburg
  '42': [51.690, 5.290],  // Den Bosch
  '43': [51.590, 5.080],  // Eindhoven-West
  '44': [51.440, 5.480],  // Eindhoven
  '45': [51.480, 5.640],  // Helmond
  '46': [51.370, 5.460],  // Valkenswaard
  '47': [51.590, 4.780],  // Breda
  '48': [51.500, 4.290],  // Bergen op Zoom
  '49': [51.570, 4.470],  // Roosendaal
  '50': [51.440, 5.470],  // Eindhoven
  '51': [51.440, 5.470],  // Eindhoven
  '52': [51.340, 5.870],  // Weert
  '53': [51.270, 5.730],  // Roermond
  '54': [51.160, 5.830],  // Sittard
  '55': [51.050, 5.700],  // Kerkrade
  '56': [50.850, 5.690],  // Maastricht
  '57': [50.870, 5.980],  // Heerlen
  '58': [50.890, 5.970],  // Heerlen
  '59': [51.170, 5.960],  // Venlo-Zuid
  '60': [51.350, 6.170],  // Venlo
  '61': [51.450, 6.050],  // Venray
  '62': [51.430, 5.990],  // Tegelen
  '63': [51.820, 5.860],  // Nijmegen
  '64': [51.960, 5.910],  // Arnhem
  '65': [51.970, 5.920],  // Arnhem
  '66': [51.960, 5.880],  // Arnhem
  '67': [52.010, 6.120],  // Doetinchem
  '68': [52.060, 6.190],  // Doetinchem
  '69': [51.890, 5.970],  // Wageningen
  '70': [52.220, 6.000],  // Apeldoorn
  '71': [52.220, 5.960],  // Apeldoorn
  '72': [52.350, 6.060],  // Deventer
  '73': [52.430, 6.250],  // Enschede-West
  '74': [52.220, 6.900],  // Enschede
  '75': [52.510, 6.100],  // Zwolle
  '76': [52.540, 6.100],  // Zwolle
  '77': [52.650, 6.400],  // Hoogeveen
  '78': [52.440, 6.620],  // Almelo
  '79': [52.730, 6.500],  // Emmen
  '80': [52.510, 6.090],  // Zwolle
  '81': [52.520, 6.100],  // Zwolle
  '82': [52.750, 6.210],  // Meppel
  '83': [52.780, 6.560],  // Assen
  '84': [52.830, 6.100],  // Steenwijk
  '85': [52.970, 5.930],  // Heerenveen
  '86': [53.010, 5.660],  // Sneek
  '87': [53.100, 5.660],  // Franeker
  '88': [53.200, 5.800],  // Leeuwarden
  '89': [53.200, 5.790],  // Leeuwarden
  '90': [53.220, 6.570],  // Groningen
  '91': [53.220, 6.570],  // Groningen
  '92': [53.250, 6.540],  // Groningen
  '93': [53.330, 6.610],  // Delfzijl
  '94': [53.170, 6.750],  // Veendam
  '95': [53.100, 7.050],  // Stadskanaal
  '96': [53.250, 6.520],  // Groningen-West
  '97': [53.120, 6.650],  // Zuidlaren
  '98': [53.050, 6.920],  // Emmen-Noord
  '99': [53.300, 6.620],  // Uithuizen
  // Flevoland
  '13': [52.350, 5.220],  // Almere
}

export function getPostcodeCoords(postcode: string): [number, number] | null {
  const clean = postcode.replace(/\s/g, '').toUpperCase()
  const prefix = clean.substring(0, 2)
  return postcodeCoords[prefix] || null
}

export function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
