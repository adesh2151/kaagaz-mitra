// Renewal reminders.
//
// On the Android app (Capacitor) these become real scheduled notifications that
// fire even when the app is closed. In a plain browser PWA, background
// scheduling isn't reliable, so the app also always shows a "due soon" list on
// the dashboard — that list is the guaranteed, can't-fail reminder. The native
// notification is a bonus on top.

let pluginPromise = null
function getPlugin() {
  if (!window.Capacitor?.isNativePlatform?.()) return Promise.resolve(null)
  if (!pluginPromise) {
    pluginPromise = import('@capacitor/local-notifications')
      .then((m) => m.LocalNotifications)
      .catch(() => null)
  }
  return pluginPromise
}

export async function ensurePermission() {
  const plugin = await getPlugin()
  if (!plugin) return false
  try {
    const res = await plugin.requestPermissions()
    return res.display === 'granted'
  } catch {
    return false
  }
}

// Schedule a reminder 7 days before expiry and on the day itself.
export async function scheduleForDoc(doc, title, body) {
  const plugin = await getPlugin()
  if (!plugin || !doc.expiryDate) return
  try {
    const expiry = new Date(doc.expiryDate)
    const base = Math.abs(hashId(doc.id)) % 100000
    const notifs = []
    for (const [i, daysBefore] of [7, 0].entries()) {
      const at = new Date(expiry)
      at.setDate(at.getDate() - daysBefore)
      at.setHours(9, 0, 0, 0)
      if (at.getTime() > Date.now()) {
        notifs.push({ id: base * 10 + i, title, body, schedule: { at } })
      }
    }
    if (notifs.length) await plugin.schedule({ notifications: notifs })
  } catch {
    /* ignore — the dashboard list still covers it */
  }
}

function hashId(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return h
}

// Days until expiry (negative = already expired). null if no date.
export function daysUntil(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  if (isNaN(d)) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  d.setHours(0, 0, 0, 0)
  return Math.round((d - today) / 86400000)
}
