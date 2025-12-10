import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { motion } from 'framer-motion';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ServiceCoverageMap = () => {
  // Dhaka, Bangladesh coordinates
  const center = [23.8103, 90.4125];
  const coverageRadius = 15000; // 15 km radius

  // Service locations (example data)
  const serviceLocations = [
    {
      id: 1,
      name: 'Main Office - Gulshan',
      position: [23.7808, 90.4172],
      type: 'office',
      services: ['Wedding', 'Corporate', 'Home Decoration']
    },
    {
      id: 2,
      name: 'Branch - Dhanmondi',
      position: [23.7461, 90.3742],
      type: 'branch',
      services: ['Home Decoration', 'Birthday Parties']
    },
    {
      id: 3,
      name: 'Branch - Uttara',
      position: [23.8759, 90.3795],
      type: 'branch',
      services: ['Wedding', 'Office Events']
    },
    {
      id: 4,
      name: 'Branch - Mirpur',
      position: [23.8223, 90.3654],
      type: 'branch',
      services: ['All Services']
    },
  ];

  // Custom marker icons
  const officeIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const branchIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Service Coverage Map
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We serve throughout Dhaka and surrounding areas. Find our nearest branch and check if we cover your location.
          </p>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border-2 border-purple-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Main Office</h3>
                <p className="text-sm text-gray-600">Gulshan, Dhaka</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border-2 border-blue-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{serviceLocations.length - 1} Branches</h3>
                <p className="text-sm text-gray-600">Across Dhaka</p>
              </div>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border-2 border-green-300">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-900">15 KM Radius</h3>
                <p className="text-sm text-gray-600">Coverage Area</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border-4 border-purple-300"
        >
          <MapContainer
            center={center}
            zoom={12}
            style={{ height: '600px', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Coverage circles */}
            {serviceLocations.map((location) => (
              <Circle
                key={`circle-${location.id}`}
                center={location.position}
                radius={coverageRadius}
                pathOptions={{
                  color: location.type === 'office' ? '#ef4444' : '#3b82f6',
                  fillColor: location.type === 'office' ? '#fca5a5' : '#93c5fd',
                  fillOpacity: 0.2
                }}
              />
            ))}

            {/* Location markers */}
            {serviceLocations.map((location) => (
              <Marker
                key={location.id}
                position={location.position}
                icon={location.type === 'office' ? officeIcon : branchIcon}
              >
                <Popup>
                  <div className="p-2">
                    <h3 className="font-bold text-gray-900 mb-2">{location.name}</h3>
                    <p className="text-sm font-semibold text-purple-600 mb-1">Services Available:</p>
                    <ul className="text-sm text-gray-600">
                      {location.services.map((service, index) => (
                        <li key={index} className="flex items-center gap-1">
                          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg border-2 border-purple-300"
        >
          <h3 className="font-bold text-gray-900 mb-4">Map Legend</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500 rounded-full"></div>
              <span className="text-gray-700">Main Office & Full Service Coverage</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">Branch Office</span>
            </div>
          </div>
          <div className="mt-4 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Each location provides services within a 15 km radius. For locations outside our coverage area, please contact us for special arrangements.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ServiceCoverageMap;
