# 🗂️ Kaagaz Mitra (कागज मित्र)

**All your family's documents, safe on your phone — and never miss a renewal.**

A fully **offline, private** app to keep every important document (Aadhaar, PAN,
licence, insurance, RC, passport, FD, bills, marksheets…) in one place, with
**renewal reminders** so insurance never lapses and the licence never expires
unnoticed. Marathi / Hindi / English.

Built in the same spirit as [Yojana Mitra](https://github.com/adesh2151/yojana-mitra)
and [Shetkari Mitra](https://github.com/adesh2151/shetkari-mitra): simple,
vernacular, and it just works.

## Why it can't really break

- **Everything stays on your phone.** No server, no account, no cloud. Nothing
  is uploaded.
- **Works fully offline.** Data lives in on-device storage (IndexedDB).
- **No restricted permissions** — only the camera (to snap a document) and local
  reminders. No SMS, no calls, nothing Google can block.
- **Useful on its own** from the very first document — no other users needed.

## What it does

- 📁 **Document vault** — scan/photograph a document, tag its type and family
  member, add number + dates + notes. Stored safely on the device.
- ⏰ **Renewal reminders** — set a renewal/expiry date; the dashboard always shows
  what's **expired** or **due soon**, and the Android app also fires real
  notifications a week before.
- 👪 **Family profiles** — keep everyone's papers separate but in one app.
- 🔎 **Instant search** — find any document in a tap, even with no signal.
- 🔒 **App lock (PIN)** + **Backup / Restore** — export an encryptable backup
  file so you never lose your data.

## Tech

- React 18 + Vite 5 (PWA — installable, offline)
- IndexedDB for on-device storage (images kept as data-URLs)
- Capacitor 6 + `@capacitor/local-notifications` for the Android app
- No backend. No external API.

## Develop

```bash
npm install
npm run dev                       # local dev server
npm run build                     # production build -> dist/
npm run preview                   # preview the build

# Android APK (Capacitor) — needs an Android SDK + JDK 17+
npm run cap:add:android
npm run build && npx cap sync
cd android && ./gradlew assembleDebug
# -> android/app/build/outputs/apk/debug/app-debug.apk
```

The built APK is published on the
**[releases page](https://github.com/adesh2151/kaagaz-mitra/releases)**.

## License

MIT (see `LICENSE`).
