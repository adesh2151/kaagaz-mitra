// UI strings — Marathi + Hindi + English.

export const LANGS = [
  { code: 'mr', label: 'मराठी' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'en', label: 'English' },
]

export const UI = {
  appName: { en: 'Kaagaz Mitra', mr: 'कागज मित्र', hi: 'कागज़ मित्र' },
  tagline: {
    en: 'All your documents, safe on your phone. Never miss a renewal.',
    mr: 'तुमची सर्व कागदपत्रे, फोनमध्ये सुरक्षित. नूतनीकरण कधीही चुकणार नाही.',
    hi: 'आपके सभी दस्तावेज़, फोन में सुरक्षित. नवीनीकरण कभी न चूकें.',
  },
  dueSoon: { en: 'Renewals due soon', mr: 'लवकरच नूतनीकरण', hi: 'जल्द नवीनीकरण' },
  expired: { en: 'Expired', mr: 'मुदत संपली', hi: 'समय समाप्त' },
  allDocs: { en: 'All documents', mr: 'सर्व कागदपत्रे', hi: 'सभी दस्तावेज़' },
  addDoc: { en: 'Add document', mr: 'कागदपत्र जोडा', hi: 'दस्तावेज़ जोड़ें' },
  members: { en: 'Family', mr: 'कुटुंब', hi: 'परिवार' },
  everyone: { en: 'Everyone', mr: 'सर्व', hi: 'सभी' },
  addMember: { en: 'Add family member', mr: 'कुटुंब सदस्य जोडा', hi: 'परिवार सदस्य जोड़ें' },
  name: { en: 'Name', mr: 'नाव', hi: 'नाम' },
  relation: { en: 'Relation (optional)', mr: 'नाते (ऐच्छिक)', hi: 'रिश्ता (वैकल्पिक)' },
  docType: { en: 'Document type', mr: 'कागदपत्राचा प्रकार', hi: 'दस्तावेज़ का प्रकार' },
  whose: { en: 'Whose document?', mr: 'कोणाचे कागदपत्र?', hi: 'किसका दस्तावेज़?' },
  title: { en: 'Title / short name', mr: 'शीर्षक / छोटे नाव', hi: 'शीर्षक / छोटा नाम' },
  number: { en: 'Number (optional)', mr: 'क्रमांक (ऐच्छिक)', hi: 'नंबर (वैकल्पिक)' },
  issueDate: { en: 'Issue date (optional)', mr: 'जारी तारीख (ऐच्छिक)', hi: 'जारी तिथि (वैकल्पिक)' },
  expiryDate: { en: 'Renewal / expiry date', mr: 'नूतनीकरण / मुदत तारीख', hi: 'नवीनीकरण / समाप्ति तिथि' },
  notes: { en: 'Notes (optional)', mr: 'टिप्पणी (ऐच्छिक)', hi: 'टिप्पणी (वैकल्पिक)' },
  photo: { en: 'Photo or PDF of document', mr: 'कागदपत्राचा फोटो किंवा PDF', hi: 'दस्तावेज़ का फोटो या PDF' },
  addPhoto: { en: 'Add / change photo or PDF', mr: 'फोटो / PDF जोडा किंवा बदला', hi: 'फोटो / PDF जोड़ें या बदलें' },
  save: { en: 'Save', mr: 'जतन करा', hi: 'सहेजें' },
  cancel: { en: 'Cancel', mr: 'रद्द करा', hi: 'रद्द करें' },
  delete: { en: 'Delete', mr: 'हटवा', hi: 'हटाएं' },
  confirmDelete: { en: 'Delete this document?', mr: 'हे कागदपत्र हटवायचे?', hi: 'यह दस्तावेज़ हटाएं?' },
  edit: { en: 'Edit', mr: 'संपादन', hi: 'संपादित' },
  back: { en: 'Back', mr: 'मागे', hi: 'पीछे' },
  search: { en: 'Search documents…', mr: 'कागदपत्रे शोधा…', hi: 'दस्तावेज़ खोजें…' },
  empty: {
    en: 'No documents yet. Tap “Add document” to keep your first one safe.',
    mr: 'अजून कागदपत्र नाही. पहिले कागदपत्र सुरक्षित ठेवण्यासाठी “कागदपत्र जोडा” दाबा.',
    hi: 'अभी कोई दस्तावेज़ नहीं. पहला सुरक्षित रखने के लिए “दस्तावेज़ जोड़ें” दबाएं.',
  },
  daysLeft: { en: 'days left', mr: 'दिवस बाकी', hi: 'दिन बचे' },
  expiredAgo: { en: 'expired', mr: 'मुदत संपली', hi: 'समाप्त' },
  reminderOn: { en: 'Reminder set', mr: 'स्मरण लावले', hi: 'रिमाइंडर सेट' },
  backup: { en: 'Backup', mr: 'बॅकअप', hi: 'बैकअप' },
  restore: { en: 'Restore', mr: 'पुनर्संचयित', hi: 'पुनर्स्थापित' },
  backupDone: { en: 'Backup file downloaded.', mr: 'बॅकअप फाईल डाउनलोड झाली.', hi: 'बैकअप फ़ाइल डाउनलोड हुई.' },
  restoreDone: { en: 'Documents restored.', mr: 'कागदपत्रे पुनर्संचयित झाली.', hi: 'दस्तावेज़ पुनर्स्थापित हुए.' },
  lock: { en: 'App lock (PIN)', mr: 'अ‍ॅप लॉक (पिन)', hi: 'ऐप लॉक (पिन)' },
  setPin: { en: 'Set a 4-digit PIN', mr: '4-अंकी पिन ठेवा', hi: '4 अंक का पिन सेट करें' },
  enterPin: { en: 'Enter PIN', mr: 'पिन टाका', hi: 'पिन डालें' },
  wrongPin: { en: 'Wrong PIN', mr: 'चुकीचा पिन', hi: 'गलत पिन' },
  removePin: { en: 'Remove PIN', mr: 'पिन काढा', hi: 'पिन हटाएं' },
  privacy: {
    en: 'Everything stays on this phone only. Nothing is uploaded. Take a backup regularly.',
    mr: 'सर्व काही फक्त याच फोनमध्ये राहते. काहीही अपलोड होत नाही. नियमित बॅकअप घ्या.',
    hi: 'सब कुछ सिर्फ़ इसी फोन में रहता है. कुछ भी अपलोड नहीं होता. नियमित बैकअप लें.',
  },
  getAndroid: { en: 'Get the Android app', mr: 'अँड्रॉइड अ‍ॅप मिळवा', hi: 'एंड्रॉइड ऐप पाएं' },
  moreApps: { en: 'More free apps by Adesh', mr: 'अदेशचे आणखी मोफत अ‍ॅप्स', hi: 'अदेश के और मुफ़्त ऐप्स' },
}

export function t(entry, lang) {
  if (!entry) return ''
  return entry[lang] ?? entry.en ?? ''
}
