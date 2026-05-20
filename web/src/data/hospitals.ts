export interface Hospital {
  id: string;
  name: string;
  nameRw: string;
  district: string;
  type: 'hospital' | 'health_center';
  phone: string;
  lat: number;
  lng: number;
}

export const HOSPITALS: Hospital[] = [
  // ── Kigali City ──────────────────────────────────────────────
  { id: 'kf',   name: 'King Faisal Hospital',          nameRw: 'Ibitaro King Faisal',        district: 'Gasabo',     type: 'hospital',       phone: '+250 252 582 421', lat: -1.9441, lng: 30.0619 },
  { id: 'kib',  name: 'Kibagabaga District Hospital',  nameRw: 'Ibitaro bya Kibagabaga',     district: 'Gasabo',     type: 'hospital',       phone: '+250 252 570 310', lat: -1.9226, lng: 30.1120 },
  { id: 'chuk', name: 'CHUK University Hospital',      nameRw: 'CHUK',                       district: 'Kicukiro',   type: 'hospital',       phone: '+250 252 575 555', lat: -1.9500, lng: 30.0617 },
  { id: 'mas',  name: 'Masaka District Hospital',      nameRw: 'Ibitaro bya Masaka',         district: 'Kicukiro',   type: 'hospital',       phone: '+250 252 587 390', lat: -2.0116, lng: 30.0981 },
  { id: 'mur',  name: 'Muhima District Hospital',      nameRw: 'Ibitaro bya Muhima',         district: 'Nyarugenge', type: 'hospital',       phone: '+250 252 576 541', lat: -1.9590, lng: 30.0530 },

  // ── Northern Province ─────────────────────────────────────────
  { id: 'mus',  name: 'Musanze District Hospital',     nameRw: 'Ibitaro bya Musanze',        district: 'Musanze',    type: 'hospital',       phone: '+250 252 546 433', lat: -1.4996, lng: 29.6344 },
  { id: 'but',  name: 'Butaro District Hospital',      nameRw: 'Ibitaro bya Butaro',         district: 'Burera',     type: 'hospital',       phone: '+250 252 564 503', lat: -1.3965, lng: 29.8018 },
  { id: 'byu',  name: 'Byumba District Hospital',      nameRw: 'Ibitaro bya Byumba',         district: 'Gicumbi',    type: 'hospital',       phone: '+250 252 564 285', lat: -1.5773, lng: 30.0677 },
  { id: 'rul',  name: 'Rulindo District Hospital',     nameRw: 'Ibitaro bya Rulindo',        district: 'Rulindo',    type: 'hospital',       phone: '+250 252 563 001', lat: -1.7395, lng: 29.9874 },
  { id: 'gak',  name: 'Ruli District Hospital',        nameRw: 'Ibitaro bya Ruli',           district: 'Gakenke',    type: 'hospital',       phone: '+250 252 564 001', lat: -1.5610, lng: 29.8130 },

  // ── Eastern Province ──────────────────────────────────────────
  { id: 'rwa',  name: 'Rwamagana District Hospital',   nameRw: 'Ibitaro bya Rwamagana',      district: 'Rwamagana',  type: 'hospital',       phone: '+250 252 567 521', lat: -1.9481, lng: 30.4353 },
  { id: 'kib2', name: 'Kibungo District Hospital',     nameRw: 'Ibitaro bya Kibungo',        district: 'Ngoma',      type: 'hospital',       phone: '+250 252 566 028', lat: -2.1607, lng: 30.5459 },
  { id: 'nya',  name: 'Nyamata District Hospital',     nameRw: 'Ibitaro bya Nyamata',        district: 'Bugesera',   type: 'hospital',       phone: '+250 252 580 026', lat: -2.1453, lng: 30.1178 },
  { id: 'nyag', name: 'Nyagatare District Hospital',   nameRw: 'Ibitaro bya Nyagatare',      district: 'Nyagatare',  type: 'hospital',       phone: '+250 252 568 001', lat: -1.2967, lng: 30.3300 },
  { id: 'gah',  name: 'Gahini Hospital',               nameRw: 'Ibitaro bya Gahini',         district: 'Kayonza',    type: 'hospital',       phone: '+250 252 568 150', lat: -1.8350, lng: 30.5020 },
  { id: 'kir',  name: 'Kirehe District Hospital',      nameRw: 'Ibitaro bya Kirehe',         district: 'Kirehe',     type: 'hospital',       phone: '+250 252 568 100', lat: -2.2460, lng: 30.6760 },
  { id: 'ngar', name: 'Ngarama Health Center',         nameRw: 'Ikigo nderabuzima Ngarama',  district: 'Gatsibo',    type: 'health_center',  phone: '+250 252 567 001', lat: -1.5200, lng: 30.4500 },

  // ── Western Province ──────────────────────────────────────────
  { id: 'gis',  name: 'Gisenyi District Hospital',     nameRw: 'Ibitaro bya Gisenyi',        district: 'Rubavu',     type: 'hospital',       phone: '+250 252 540 333', lat: -1.7030, lng: 29.2573 },
  { id: 'kib3', name: 'Kibuye District Hospital',      nameRw: 'Ibitaro bya Kibuye',         district: 'Karongi',    type: 'hospital',       phone: '+250 252 568 241', lat: -2.0625, lng: 29.3461 },
  { id: 'kam',  name: 'Kamembe District Hospital',     nameRw: 'Ibitaro bya Kamembe',        district: 'Rusizi',     type: 'hospital',       phone: '+250 252 537 017', lat: -2.4792, lng: 28.9069 },
  { id: 'mib',  name: 'Mibilizi Hospital',             nameRw: 'Ibitaro bya Mibilizi',       district: 'Nyamasheke', type: 'hospital',       phone: '+250 252 537 100', lat: -2.3500, lng: 29.0700 },
  { id: 'ngo',  name: 'Ngororero District Hospital',   nameRw: 'Ibitaro bya Ngororero',      district: 'Ngororero',  type: 'hospital',       phone: '+250 252 562 100', lat: -1.8780, lng: 29.5710 },
  { id: 'shi',  name: 'Shyira Hospital',               nameRw: 'Ibitaro bya Shyira',         district: 'Nyabihu',    type: 'hospital',       phone: '+250 252 546 001', lat: -1.5800, lng: 29.4000 },
  { id: 'rut',  name: 'Rutsiro District Hospital',     nameRw: 'Ibitaro bya Rutsiro',        district: 'Rutsiro',    type: 'hospital',       phone: '+250 252 562 200', lat: -1.8600, lng: 29.3800 },

  // ── Southern Province ─────────────────────────────────────────
  { id: 'chub', name: 'CHUB University Hospital',      nameRw: 'CHUB / Ibitaro bya Butare',  district: 'Huye',       type: 'hospital',       phone: '+250 252 530 305', lat: -2.6037, lng: 29.7330 },
  { id: 'kab',  name: 'Kabgayi District Hospital',     nameRw: 'Ibitaro bya Kabgayi',        district: 'Muhanga',    type: 'hospital',       phone: '+250 252 562 001', lat: -2.0770, lng: 29.7580 },
  { id: 'ruh',  name: 'Ruhango District Hospital',     nameRw: 'Ibitaro bya Ruhango',        district: 'Ruhango',    type: 'hospital',       phone: '+250 252 563 500', lat: -2.2320, lng: 29.7780 },
  { id: 'nyan', name: 'Nyanza District Hospital',      nameRw: 'Ibitaro bya Nyanza',         district: 'Nyanza',     type: 'hospital',       phone: '+250 252 536 091', lat: -2.3496, lng: 29.7406 },
  { id: 'gisa', name: 'Gisagara District Hospital',    nameRw: 'Ibitaro bya Gisagara',       district: 'Gisagara',   type: 'hospital',       phone: '+250 252 536 200', lat: -2.5540, lng: 29.8040 },
  { id: 'kibo', name: 'Kibogora Hospital',             nameRw: 'Ibitaro bya Kibogora',       district: 'Nyamasheke', type: 'hospital',       phone: '+250 252 537 200', lat: -2.4200, lng: 29.1560 },
  { id: 'kad',  name: 'Kaduha District Hospital',      nameRw: 'Ibitaro bya Kaduha',         district: 'Nyamagabe',  type: 'hospital',       phone: '+250 252 536 300', lat: -2.5500, lng: 29.6300 },
  { id: 'kamo', name: 'Kamonyi District Hospital',     nameRw: 'Ibitaro bya Kamonyi',        district: 'Kamonyi',    type: 'hospital',       phone: '+250 252 563 200', lat: -2.0200, lng: 29.8680 },
  { id: 'mun',  name: 'Munini District Hospital',      nameRw: 'Ibitaro bya Munini',         district: 'Nyaruguru',  type: 'hospital',       phone: '+250 252 536 400', lat: -2.7650, lng: 29.7470 },
];

export const DISTRICTS = [
  'Gasabo', 'Kicukiro', 'Nyarugenge',
  'Musanze', 'Burera', 'Gicumbi', 'Rulindo', 'Gakenke',
  'Rwamagana', 'Ngoma', 'Bugesera', 'Nyagatare', 'Kayonza', 'Kirehe', 'Gatsibo',
  'Rubavu', 'Karongi', 'Rusizi', 'Nyamasheke', 'Ngororero', 'Nyabihu', 'Rutsiro',
  'Huye', 'Muhanga', 'Ruhango', 'Nyanza', 'Gisagara', 'Nyamagabe', 'Kamonyi', 'Nyaruguru',
];
