import { NextRequest, NextResponse } from 'next/server'

interface PoliceStation {
  name: string
  address: string
  phone: string
  distance: number
  coordinates: {
    lat: number
    lng: number
  }
}

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  const distance = R * c
  return Math.round(distance * 10) / 10 // Round to 1 decimal place
}

// Sample police station database (in a real app, this would be a proper database)
const POLICE_STATIONS_DB: PoliceStation[] = [
  {
    name: "Central Police Station",
    address: "123 Main Street, City Center, Mumbai, Maharashtra",
    phone: "022-22621855",
    distance: 0,
    coordinates: { lat: 19.0760, lng: 72.8777 }
  },
  {
    name: "Bandra Police Station",
    address: "456 Linking Road, Bandra West, Mumbai, Maharashtra",
    phone: "022-26422222",
    distance: 0,
    coordinates: { lat: 19.0596, lng: 72.8295 }
  },
  {
    name: "Andheri Police Station",
    address: "789 Andheri Kurla Road, Andheri East, Mumbai, Maharashtra",
    phone: "022-26831900",
    distance: 0,
    coordinates: { lat: 19.1197, lng: 72.8464 }
  },
  {
    name: "Delhi Police Station - Connaught Place",
    address: "1 Parliament Street, Connaught Place, New Delhi",
    phone: "011-23469000",
    distance: 0,
    coordinates: { lat: 28.6139, lng: 77.2090 }
  },
  {
    name: "Delhi Police Station - Dwarka",
    address: "Sector 12, Dwarka, New Delhi",
    phone: "011-28036000",
    distance: 0,
    coordinates: { lat: 28.5920, lng: 77.0580 }
  },
  {
    name: "Bangalore Police Station - Koramangala",
    address: "80 Feet Road, Koramangala, Bangalore, Karnataka",
    phone: "080-25533666",
    distance: 0,
    coordinates: { lat: 12.9716, lng: 77.5946 }
  },
  {
    name: "Chennai Police Station - T Nagar",
    address: "Pondy Bazaar, T Nagar, Chennai, Tamil Nadu",
    phone: "044-24333666",
    distance: 0,
    coordinates: { lat: 13.0827, lng: 80.2707 }
  },
  {
    name: "Hyderabad Police Station - Banjara Hills",
    address: "Road No. 12, Banjara Hills, Hyderabad, Telangana",
    phone: "040-23320555",
    distance: 0,
    coordinates: { lat: 17.3850, lng: 78.4867 }
  },
  {
    name: "Kolkata Police Station - Park Street",
    address: "Park Street, Kolkata, West Bengal",
    phone: "033-22214444",
    distance: 0,
    coordinates: { lat: 22.5726, lng: 88.3639 }
  },
  {
    name: "Pune Police Station - Koregaon Park",
    address: "North Main Road, Koregaon Park, Pune, Maharashtra",
    phone: "020-26123333",
    distance: 0,
    coordinates: { lat: 18.5204, lng: 73.8567 }
  }
]

export async function POST(request: NextRequest) {
  try {
    const { latitude, longitude, radius = 10 } = await request.json()

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return NextResponse.json(
        { error: 'Valid latitude and longitude coordinates are required' },
        { status: 400 }
      )
    }

    // Calculate distances and filter by radius
    const nearbyStations = POLICE_STATIONS_DB
      .map(station => ({
        ...station,
        distance: calculateDistance(latitude, longitude, station.coordinates.lat, station.coordinates.lng)
      }))
      .filter(station => station.distance <= radius)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5) // Return top 5 nearest stations

    // If no stations found in radius, return the nearest one
    if (nearbyStations.length === 0) {
      const nearestStation = POLICE_STATIONS_DB
        .map(station => ({
          ...station,
          distance: calculateDistance(latitude, longitude, station.coordinates.lat, station.coordinates.lng)
        }))
        .sort((a, b) => a.distance - b.distance)[0]

      return NextResponse.json({
        policeStations: [nearestStation],
        message: `No police stations found within ${radius}km. Showing nearest station.`
      })
    }

    return NextResponse.json({
      policeStations: nearbyStations,
      message: `Found ${nearbyStations.length} police station(s) within ${radius}km.`
    })

  } catch (error) {
    console.error('Police station search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 