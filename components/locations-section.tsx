"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Clock, Phone, Navigation } from "lucide-react"

// Real Long Chau pharmacy locations in Ho Chi Minh City
const realLocations = [
  {
    id: 1,
    name: "Long Chau - Hai Ba Trung HQ",
    address: "379-381 Hai Ba Trung, Vo Thi Sau Ward, District 3",
    phone: "1800 6928",
    hours: "7:00 AM - 10:00 PM",
    lat: 10.7869,
    lng: 106.6896,
    is24h: false,
    isHeadquarters: true
  },
  {
    id: 2,
    name: "Long Chau - Nguyen Trai",
    address: "123 Nguyen Trai, Nguyen Cu Trinh Ward, District 1",
    phone: "1800 6928",
    hours: "24/7",
    lat: 10.7659,
    lng: 106.6819,
    is24h: true
  },
  {
    id: 3,
    name: "Long Chau - Le Van Sy",
    address: "366 Le Van Sy, Ward 14, District 3",
    phone: "1800 6928",
    hours: "7:00 AM - 10:00 PM",
    lat: 10.7889,
    lng: 106.6769,
    is24h: false
  },
  {
    id: 4,
    name: "Long Chau - Pham Ngu Lao",
    address: "185 Pham Ngu Lao, Pham Ngu Lao Ward, District 1",
    phone: "1800 6928",
    hours: "24/7",
    lat: 10.7682,
    lng: 106.6926,
    is24h: true
  },
  {
    id: 5,
    name: "Long Chau - District 7",
    address: "S2.01 SC Vivo City, 1058 Nguyen Van Linh, Tan Phong Ward, District 7",
    phone: "1800 6928",
    hours: "8:00 AM - 10:00 PM",
    lat: 10.7292,
    lng: 106.7040,
    is24h: false
  },
  {
    id: 6,
    name: "Long Chau - Cong Hoa",
    address: "478 Cong Hoa, Ward 13, Tan Binh District",
    phone: "1800 6928",
    hours: "7:00 AM - 11:00 PM",
    lat: 10.8013,
    lng: 106.6569,
    is24h: false
  },
  {
    id: 7,
    name: "Long Chau - Bach Dang",
    address: "161 Bach Dang, Ward 2, Tan Binh District",
    phone: "1800 6928",
    hours: "24/7",
    lat: 10.8106,
    lng: 106.6649,
    is24h: true
  },
  {
    id: 8,
    name: "Long Chau - 3 Thang 2",
    address: "584 3 Thang 2, Ward 14, District 10",
    phone: "1800 6928",
    hours: "7:00 AM - 10:00 PM",
    lat: 10.7700,
    lng: 106.6703,
    is24h: false
  }
]

// Mapbox style for the embedded map
const MAPBOX_STYLE = "mapbox://styles/mapbox/light-v11"
const MAPBOX_TOKEN = "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw" // Demo token

export default function LocationsSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState<typeof realLocations[0] | null>(null)
  const [filteredLocations, setFilteredLocations] = useState(realLocations)
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 10.7769, lng: 106.7009 }) // HCMC center

  // Filter locations based on search
  useEffect(() => {
    const filtered = realLocations.filter(location =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.address.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredLocations(filtered)
  }, [searchQuery])

  // Get user's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setUserLocation(userLoc)
          setMapCenter(userLoc)
        },
        (error) => {
          console.log("Error getting location:", error)
        }
      )
    }
  }, [])

  // Calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Sort locations by distance if user location is available
  const sortedLocations = userLocation 
    ? [...filteredLocations].sort((a, b) => {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng)
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng)
        return distA - distB
      })
    : filteredLocations

  // Handle location selection
  const handleLocationSelect = (location: typeof realLocations[0]) => {
    setSelectedLocation(location)
    setMapCenter({ lat: location.lat, lng: location.lng })
  }

  // Get directions URL
  const getDirectionsUrl = (location: typeof realLocations[0]) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-light text-gray-900">
            FIND
            <br />
            LONG CHAU
          </h2>
          <h3 className="text-4xl md:text-6xl font-light italic text-gray-700 mt-4">near you</h3>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by location or address..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:border-gray-400 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Locations List */}
          <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {sortedLocations.map((location) => (
              <div
                key={location.id}
                className={`bg-white p-4 rounded-lg cursor-pointer transition-all hover:shadow-lg ${
                  selectedLocation?.id === location.id ? 'ring-2 ring-gray-900' : ''
                }`}
                onClick={() => handleLocationSelect(location)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    {location.name}
                    {location.isHeadquarters && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">HQ</span>
                    )}
                  </h4>
                  {location.is24h && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">24/7</span>
                  )}
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>{location.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <p>{location.phone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <p>{location.hours}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  {userLocation && (
                    <p className="text-xs text-gray-500">
                      ~{calculateDistance(userLocation.lat, userLocation.lng, location.lat, location.lng).toFixed(1)} km away
                    </p>
                  )}
                  <a
                    href={getDirectionsUrl(location)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Navigation className="h-3 w-3" />
                    Get directions
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Map Container */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg overflow-hidden shadow-lg h-[600px]">
              {/* OpenStreetMap iframe */}
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lng - 0.05},${mapCenter.lat - 0.03},${mapCenter.lng + 0.05},${mapCenter.lat + 0.03}&layer=mapnik&marker=${mapCenter.lat},${mapCenter.lng}`}
                style={{ border: 0 }}
              >
              </iframe>
            </div>
            
            {/* Selected Location Info */}
            {selectedLocation && (
              <div className="mt-4 bg-white p-4 rounded-lg shadow">
                <h4 className="font-medium text-gray-900 mb-2">{selectedLocation.name}</h4>
                <p className="text-sm text-gray-600 mb-3">{selectedLocation.address}</p>
                <div className="flex gap-4">
                  <a
                    href={getDirectionsUrl(selectedLocation)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors"
                  >
                    <Navigation className="h-4 w-4" />
                    Get Directions
                  </a>
                  <a
                    href={`tel:${selectedLocation.phone}`}
                    className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-sm hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="h-4 w-4" />
                    Call Store
                  </a>
                </div>
              </div>
            )}
            
            {/* Map Legend */}
            <div className="mt-4 flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <span>24/7 Locations</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-gray-900" />
                <span>Regular Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-blue-500" />
                <span>Headquarters</span>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-12 grid grid-cols-3 gap-4 text-center max-w-2xl mx-auto">
          <div>
            <p className="text-3xl font-light text-gray-900">1700+</p>
            <p className="text-sm text-gray-600">Locations Nationwide</p>
          </div>
          <div>
            <p className="text-3xl font-light text-gray-900">1600</p>
            <p className="text-sm text-gray-600">Stores in HCMC</p>
          </div>
          <div>
            <p className="text-3xl font-light text-gray-900">24/7</p>
            <p className="text-sm text-gray-600">Service Available</p>
          </div>
        </div>
      </div>
    </section>
  )
}