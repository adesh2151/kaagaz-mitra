// Common Indian document types, trilingual. `expiry:true` means the type
// usually has a renewal/expiry date, so the form nudges the user to set one.

export const DOC_TYPES = [
  { id: 'aadhaar', icon: '🆔', expiry: false, label: { en: 'Aadhaar Card', mr: 'आधार कार्ड', hi: 'आधार कार्ड' } },
  { id: 'pan', icon: '💳', expiry: false, label: { en: 'PAN Card', mr: 'पॅन कार्ड', hi: 'पैन कार्ड' } },
  { id: 'voter', icon: '🗳️', expiry: false, label: { en: 'Voter ID', mr: 'मतदार ओळखपत्र', hi: 'वोटर आईडी' } },
  { id: 'licence', icon: '🚗', expiry: true, label: { en: 'Driving Licence', mr: 'वाहन परवाना', hi: 'ड्राइविंग लाइसेंस' } },
  { id: 'passport', icon: '🛂', expiry: true, label: { en: 'Passport', mr: 'पासपोर्ट', hi: 'पासपोर्ट' } },
  { id: 'ration', icon: '🍚', expiry: false, label: { en: 'Ration Card', mr: 'रेशन कार्ड', hi: 'राशन कार्ड' } },
  { id: 'rc', icon: '📄', expiry: false, label: { en: 'Vehicle RC', mr: 'वाहन आरसी', hi: 'वाहन आरसी' } },
  { id: 'vehins', icon: '🛵', expiry: true, label: { en: 'Vehicle Insurance', mr: 'वाहन विमा', hi: 'वाहन बीमा' } },
  { id: 'puc', icon: '💨', expiry: true, label: { en: 'PUC Certificate', mr: 'पीयूसी प्रमाणपत्र', hi: 'पीयूसी प्रमाणपत्र' } },
  { id: 'healthins', icon: '🏥', expiry: true, label: { en: 'Health Insurance', mr: 'आरोग्य विमा', hi: 'स्वास्थ्य बीमा' } },
  { id: 'lifeins', icon: '🛡️', expiry: true, label: { en: 'Life Insurance (LIC)', mr: 'जीवन विमा (LIC)', hi: 'जीवन बीमा (LIC)' } },
  { id: 'bank', icon: '🏦', expiry: false, label: { en: 'Bank Passbook', mr: 'बँक पासबुक', hi: 'बैंक पासबुक' } },
  { id: 'fd', icon: '💰', expiry: true, label: { en: 'FD / Deposit', mr: 'मुदत ठेव (FD)', hi: 'एफडी / जमा' } },
  { id: 'property', icon: '🏠', expiry: false, label: { en: 'Property / Land', mr: 'मालमत्ता / जमीन', hi: 'संपत्ति / ज़मीन' } },
  { id: 'certificate', icon: '🎓', expiry: false, label: { en: 'Marksheet / Certificate', mr: 'गुणपत्रिका / प्रमाणपत्र', hi: 'अंकसूची / प्रमाणपत्र' } },
  { id: 'bill', icon: '🧾', expiry: true, label: { en: 'Bill (due date)', mr: 'बिल (देय तारीख)', hi: 'बिल (देय तिथि)' } },
  { id: 'gas', icon: '🔥', expiry: false, label: { en: 'Gas Connection', mr: 'गॅस जोडणी', hi: 'गैस कनेक्शन' } },
  { id: 'warranty', icon: '🧰', expiry: true, label: { en: 'Warranty / AMC', mr: 'वॉरंटी / एएमसी', hi: 'वारंटी / एएमसी' } },
  { id: 'other', icon: '📎', expiry: true, label: { en: 'Other', mr: 'इतर', hi: 'अन्य' } },
]

export const typeById = (id) => DOC_TYPES.find((t) => t.id === id) || DOC_TYPES[DOC_TYPES.length - 1]
