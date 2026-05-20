import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Phone, MapPin, Building2, HeartPulse } from 'lucide-react';
import { HOSPITALS, DISTRICTS, type Hospital } from '../data/hospitals';

// Fix default leaflet marker icons for Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
});

const hospitalIcon = new L.Icon({
  iconUrl: new URL('leaflet/dist/images/marker-icon.png', import.meta.url).href,
  iconRetinaUrl: new URL('leaflet/dist/images/marker-icon-2x.png', import.meta.url).href,
  shadowUrl: new URL('leaflet/dist/images/marker-shadow.png', import.meta.url).href,
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lng], 12, { duration: 1.2 }); }, [lat, lng, map]);
  return null;
}

interface Props {
  district: string;
  lang: 'rw' | 'en';
}

export default function HospitalMap({ district: initialDistrict, lang }: Props) {
  const [selectedDistrict, setSelectedDistrict] = useState(initialDistrict || 'Gasabo');
  const hospitals = HOSPITALS.filter(h => h.district === selectedDistrict);
  const center = hospitals.length
    ? { lat: hospitals[0].lat, lng: hospitals[0].lng }
    : { lat: -1.9403, lng: 29.8739 }; // Rwanda center fallback

  return (
    <div>
      {/* District selector */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '.5px', display: 'block', marginBottom: 6 }}>
          {lang === 'rw' ? 'Hitamo akarere kawe' : 'Select your district'}
        </label>
        <select
          value={selectedDistrict}
          onChange={e => setSelectedDistrict(e.target.value)}
          style={{
            width: '100%', padding: '10px 14px', borderRadius: 8,
            border: '1.5px solid var(--border)', background: 'var(--white)',
            fontSize: 14, fontWeight: 600, color: 'var(--gray-800)', cursor: 'pointer',
          }}
        >
          {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Map */}
      <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: 16 }}>
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={11}
          style={{ height: 280, width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FlyTo lat={center.lat} lng={center.lng} />
          {hospitals.map(h => (
            <Marker key={h.id} position={[h.lat, h.lng]} icon={hospitalIcon}>
              <Popup>
                <div style={{ minWidth: 180 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>
                    {lang === 'rw' ? h.nameRw : h.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#555', marginBottom: 6 }}>
                    {h.type === 'hospital'
                      ? (lang === 'rw' ? 'Ibitaro' : 'District Hospital')
                      : (lang === 'rw' ? 'Ikigo nderabuzima' : 'Health Center')}
                  </div>
                  <a
                    href={`tel:${h.phone.replace(/\s/g, '')}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: '#2D6A4F', fontWeight: 700, textDecoration: 'none' }}
                  >
                    📞 {h.phone}
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Hospital list */}
      {hospitals.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--gray-500)', fontSize: 14 }}>
          {lang === 'rw' ? 'Nta bitaro bigaragara muri aka karere.' : 'No facilities listed for this district yet.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: '.5px' }}>
            {lang === 'rw' ? `Ibitaro ${hospitals.length} mu karere ka ${selectedDistrict}` : `${hospitals.length} facilit${hospitals.length === 1 ? 'y' : 'ies'} in ${selectedDistrict}`}
          </div>
          {hospitals.map(h => (
            <div key={h.id} style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              background: 'var(--white)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '14px 16px',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                background: h.type === 'hospital' ? 'var(--green-50)' : '#EDE7F6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {h.type === 'hospital'
                  ? <Building2 size={18} strokeWidth={1.8} color="var(--green-700)" />
                  : <HeartPulse size={18} strokeWidth={1.8} color="#7C3AED" />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-900)', marginBottom: 2 }}>
                  {lang === 'rw' ? h.nameRw : h.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--gray-500)', marginBottom: 8 }}>
                  <MapPin size={11} strokeWidth={2} />
                  {h.district} · {h.type === 'hospital'
                    ? (lang === 'rw' ? 'Ibitaro' : 'Hospital')
                    : (lang === 'rw' ? 'Ikigo nderabuzima' : 'Health Center')}
                </div>
                <a
                  href={`tel:${h.phone.replace(/\s/g, '')}`}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '7px 14px', borderRadius: 20,
                    background: 'var(--green-50)', border: '1px solid var(--green-200)',
                    color: 'var(--green-700)', fontSize: 13, fontWeight: 700,
                    textDecoration: 'none', transition: 'all .15s',
                  }}
                >
                  <Phone size={13} strokeWidth={2} />
                  {h.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
