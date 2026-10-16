import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { DOC_TYPES, typeById } from './data/docTypes'
import { del, exportAll, getAll, importAll, put, uid } from './db'
import { LANGS, UI, t } from './i18n'
import { daysUntil, ensurePermission, scheduleForDoc } from './notify'

const HUB_URL = 'https://adesh2151.github.io/'
const APK_URL = 'https://github.com/adesh2151/kaagaz-mitra/releases/download/apk/KaagazMitra.apk'
const LS_LANG = 'km_lang'
const LS_PIN = 'km_pin'
const DUE_SOON_DAYS = 45

// ---- small helpers --------------------------------------------------------
function lsGet(k, f) {
  try {
    const v = localStorage.getItem(k)
    return v == null ? f : v
  } catch {
    return f
  }
}
function lsSet(k, v) {
  try {
    v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v)
  } catch {
    /* ignore */
  }
}
function hashPin(pin) {
  let h = 0
  const s = 'km:' + pin
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return String(h)
}

// Downscale a captured photo so IndexedDB stays small.
function fileToDataUrl(file, max = 1400, quality = 0.72) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      const img = new Image()
      img.onerror = reject
      img.onload = () => {
        let { width, height } = img
        if (width > height && width > max) {
          height = Math.round((height * max) / width)
          width = max
        } else if (height >= width && height > max) {
          width = Math.round((width * max) / height)
          height = max
        }
        const c = document.createElement('canvas')
        c.width = width
        c.height = height
        c.getContext('2d').drawImage(img, 0, 0, width, height)
        resolve(c.toDataURL('image/jpeg', quality))
      }
      img.src = reader.result
    }
    reader.readAsDataURL(file)
  })
}

export default function App() {
  const [lang, setLang] = useState(() => lsGet(LS_LANG, 'mr'))
  const [unlocked, setUnlocked] = useState(() => !lsGet(LS_PIN, null))
  const [screen, setScreen] = useState('home') // home | form | detail | settings
  const [docs, setDocs] = useState([])
  const [members, setMembers] = useState([])
  const [editing, setEditing] = useState(null)
  const [active, setActive] = useState(null)

  useEffect(() => lsSet(LS_LANG, lang), [lang])

  async function reload() {
    const [d, m] = await Promise.all([getAll('docs'), getAll('members')])
    setDocs(d)
    setMembers(m)
  }
  useEffect(() => {
    reload()
    ensurePermission()
  }, [])

  if (!unlocked) return <Lock lang={lang} onOk={() => setUnlocked(true)} />

  const memberName = (id) => members.find((m) => m.id === id)?.name || ''

  return (
    <div className="app">
      <header className="topbar">
        <span className="brand" onClick={() => setScreen('home')}>
          🗂️ {t(UI.appName, lang)}
        </span>
        <div className="right">
          <div className="langs">
            {LANGS.map((l) => (
              <button
                key={l.code}
                className={`lang ${lang === l.code ? 'active' : ''}`}
                onClick={() => setLang(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
          <button className="gear" onClick={() => setScreen('settings')} aria-label="settings">
            ⚙️
          </button>
        </div>
      </header>

      <main className="screen">
        {screen === 'home' && (
          <Home
            lang={lang}
            docs={docs}
            members={members}
            memberName={memberName}
            onAdd={() => {
              setEditing(null)
              setScreen('form')
            }}
            onOpen={(d) => {
              setActive(d)
              setScreen('detail')
            }}
          />
        )}

        {screen === 'form' && (
          <DocForm
            lang={lang}
            members={members}
            initial={editing}
            onReloadMembers={reload}
            onCancel={() => setScreen(editing ? 'detail' : 'home')}
            onSaved={async (doc) => {
              await put('docs', doc)
              await scheduleForDoc(
                doc,
                `${t(UI.appName, lang)} · ${t(UI.dueSoon, lang)}`,
                `${doc.title} — ${t(typeById(doc.typeId).label, lang)}`,
              )
              await reload()
              setActive(doc)
              setScreen('detail')
            }}
          />
        )}

        {screen === 'detail' && active && (
          <Detail
            lang={lang}
            doc={active}
            memberName={memberName}
            onBack={() => setScreen('home')}
            onEdit={() => {
              setEditing(active)
              setScreen('form')
            }}
            onDelete={async () => {
              if (!confirm(t(UI.confirmDelete, lang))) return
              await del('docs', active.id)
              await reload()
              setScreen('home')
            }}
          />
        )}

        {screen === 'settings' && (
          <Settings lang={lang} onBack={() => setScreen('home')} onReload={reload} />
        )}
      </main>

      <footer className="disclaimer">
        <div className="footlinks">
          <a href={APK_URL}>📱 {t(UI.getAndroid, lang)}</a>
          <a href={HUB_URL} target="_blank" rel="noreferrer">
            🧩 {t(UI.moreApps, lang)}
          </a>
        </div>
        🔒 {t(UI.privacy, lang)}
      </footer>
    </div>
  )
}

// ---- Lock screen ----------------------------------------------------------
function Lock({ lang, onOk }) {
  const [pin, setPin] = useState('')
  const [err, setErr] = useState(false)
  function submit(v) {
    if (hashPin(v) === lsGet(LS_PIN, null)) onOk()
    else {
      setErr(true)
      setPin('')
    }
  }
  return (
    <div className="lockscreen">
      <div className="hero">🔒</div>
      <h1>{t(UI.appName, lang)}</h1>
      <p>{t(UI.enterPin, lang)}</p>
      <input
        className="pin"
        type="password"
        inputMode="numeric"
        maxLength={4}
        value={pin}
        autoFocus
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, '')
          setPin(v)
          setErr(false)
          if (v.length === 4) submit(v)
        }}
      />
      {err && <p className="errtext">{t(UI.wrongPin, lang)}</p>}
    </div>
  )
}

// ---- Home / dashboard -----------------------------------------------------
function Home({ lang, docs, members, memberName, onAdd, onOpen }) {
  const [query, setQuery] = useState('')
  const [member, setMember] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return docs.filter((d) => {
      if (member !== 'all' && d.memberId !== member) return false
      if (!q) return true
      const hay = `${d.title} ${d.number || ''} ${t(typeById(d.typeId).label, lang)} ${memberName(d.memberId)}`.toLowerCase()
      return hay.includes(q)
    })
  }, [docs, query, member, lang])

  const withDays = filtered.map((d) => ({ d, days: daysUntil(d.expiryDate) }))
  const expired = withDays.filter((x) => x.days !== null && x.days < 0).sort((a, b) => a.days - b.days)
  const dueSoon = withDays
    .filter((x) => x.days !== null && x.days >= 0 && x.days <= DUE_SOON_DAYS)
    .sort((a, b) => a.days - b.days)

  return (
    <div className="home">
      <p className="tagline">{t(UI.tagline, lang)}</p>

      <input
        className="searchbox"
        placeholder={t(UI.search, lang)}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {members.length > 0 && (
        <div className="chips">
          <button className={`chip ${member === 'all' ? 'sel' : ''}`} onClick={() => setMember('all')}>
            {t(UI.everyone, lang)}
          </button>
          {members.map((m) => (
            <button
              key={m.id}
              className={`chip ${member === m.id ? 'sel' : ''}`}
              onClick={() => setMember(m.id)}
            >
              {m.name}
            </button>
          ))}
        </div>
      )}

      {expired.length > 0 && (
        <section>
          <h3 className="band bad">⚠️ {t(UI.expired, lang)}</h3>
          {expired.map(({ d, days }) => (
            <DocRow key={d.id} d={d} days={days} lang={lang} memberName={memberName} onOpen={onOpen} />
          ))}
        </section>
      )}

      {dueSoon.length > 0 && (
        <section>
          <h3 className="band warn">⏰ {t(UI.dueSoon, lang)}</h3>
          {dueSoon.map(({ d, days }) => (
            <DocRow key={d.id} d={d} days={days} lang={lang} memberName={memberName} onOpen={onOpen} />
          ))}
        </section>
      )}

      <section>
        <h3 className="band">📁 {t(UI.allDocs, lang)}</h3>
        {filtered.length === 0 && <p className="empty">{t(UI.empty, lang)}</p>}
        {filtered.map((d) => (
          <DocRow key={d.id} d={d} days={daysUntil(d.expiryDate)} lang={lang} memberName={memberName} onOpen={onOpen} />
        ))}
      </section>

      <button className="fab" onClick={onAdd} aria-label="add">
        ＋
      </button>
    </div>
  )
}

function statusChip(days, lang) {
  if (days === null) return null
  if (days < 0) return <span className="status bad">{t(UI.expiredAgo, lang)}</span>
  if (days <= DUE_SOON_DAYS)
    return (
      <span className="status warn">
        {days} {t(UI.daysLeft, lang)}
      </span>
    )
  return null
}

function DocRow({ d, days, lang, memberName, onOpen }) {
  const type = typeById(d.typeId)
  return (
    <button className="docrow" onClick={() => onOpen(d)}>
      <span className="dtype">{type.icon}</span>
      <span className="dmid">
        <span className="dtitle">{d.title || t(type.label, lang)}</span>
        <span className="dsub">
          {t(type.label, lang)}
          {memberName(d.memberId) ? ` · ${memberName(d.memberId)}` : ''}
        </span>
      </span>
      {statusChip(days, lang)}
      <span className="chev">›</span>
    </button>
  )
}

// ---- Add / edit form ------------------------------------------------------
function DocForm({ lang, members, initial, onCancel, onSaved, onReloadMembers }) {
  const [typeId, setTypeId] = useState(initial?.typeId || DOC_TYPES[0].id)
  const [memberId, setMemberId] = useState(initial?.memberId || '')
  const [title, setTitle] = useState(initial?.title || '')
  const [number, setNumber] = useState(initial?.number || '')
  const [issueDate, setIssueDate] = useState(initial?.issueDate || '')
  const [expiryDate, setExpiryDate] = useState(initial?.expiryDate || '')
  const [notes, setNotes] = useState(initial?.notes || '')
  const [image, setImage] = useState(initial?.image || '')
  const [busy, setBusy] = useState(false)
  const fileRef = useRef(null)
  const type = typeById(typeId)

  async function pickPhoto(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    try {
      setImage(await fileToDataUrl(file))
    } catch {
      /* ignore */
    }
    setBusy(false)
  }

  async function addMemberPrompt() {
    const name = prompt(t(UI.name, lang))
    if (!name) return
    const m = { id: uid(), name: name.trim(), relation: '' }
    await put('members', m)
    await onReloadMembers()
    setMemberId(m.id)
  }

  function save() {
    const doc = {
      id: initial?.id || uid(),
      typeId,
      memberId,
      title: title.trim() || t(type.label, lang),
      number: number.trim(),
      issueDate,
      expiryDate,
      notes: notes.trim(),
      image,
      createdAt: initial?.createdAt || new Date().toISOString(),
    }
    onSaved(doc)
  }

  return (
    <div className="form">
      <button className="ghost" onClick={onCancel}>
        ← {t(UI.cancel, lang)}
      </button>
      <h2>{initial ? t(UI.edit, lang) : t(UI.addDoc, lang)}</h2>

      <label>{t(UI.docType, lang)}</label>
      <div className="typegrid">
        {DOC_TYPES.map((ty) => (
          <button
            key={ty.id}
            className={`typebtn ${typeId === ty.id ? 'sel' : ''}`}
            onClick={() => setTypeId(ty.id)}
          >
            <span className="tyi">{ty.icon}</span>
            <span className="tyl">{t(ty.label, lang)}</span>
          </button>
        ))}
      </div>

      <label>{t(UI.whose, lang)}</label>
      <div className="chips">
        <button className={`chip ${memberId === '' ? 'sel' : ''}`} onClick={() => setMemberId('')}>
          {t(UI.everyone, lang)}
        </button>
        {members.map((m) => (
          <button
            key={m.id}
            className={`chip ${memberId === m.id ? 'sel' : ''}`}
            onClick={() => setMemberId(m.id)}
          >
            {m.name}
          </button>
        ))}
        <button className="chip add" onClick={addMemberPrompt}>
          ＋ {t(UI.addMember, lang)}
        </button>
      </div>

      <label>{t(UI.title, lang)}</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t(type.label, lang)} />

      <label>{t(UI.number, lang)}</label>
      <input value={number} onChange={(e) => setNumber(e.target.value)} />

      <label>{t(UI.issueDate, lang)}</label>
      <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />

      <label>
        {t(UI.expiryDate, lang)} {type.expiry ? '⏰' : ''}
      </label>
      <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />

      <label>{t(UI.photo, lang)}</label>
      {image && <img className="preview" src={image} alt="" />}
      <button className="ghost wide" onClick={() => fileRef.current?.click()} disabled={busy}>
        📷 {t(UI.addPhoto, lang)}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={pickPhoto}
      />

      <label>{t(UI.notes, lang)}</label>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />

      <button className="cta" onClick={save} disabled={busy}>
        💾 {t(UI.save, lang)}
      </button>
    </div>
  )
}

// ---- Detail ---------------------------------------------------------------
function Detail({ lang, doc, memberName, onBack, onEdit, onDelete }) {
  const type = typeById(doc.typeId)
  const days = daysUntil(doc.expiryDate)
  return (
    <div className="detail">
      <button className="ghost" onClick={onBack}>
        ← {t(UI.back, lang)}
      </button>
      <h2>
        {type.icon} {doc.title}
      </h2>
      <p className="dsub">
        {t(type.label, lang)}
        {memberName(doc.memberId) ? ` · ${memberName(doc.memberId)}` : ''}
      </p>

      {doc.image && (
        <a href={doc.image} target="_blank" rel="noreferrer">
          <img className="preview big" src={doc.image} alt="" />
        </a>
      )}

      <div className="fields">
        {doc.number && (
          <Field label={t(UI.number, lang)} value={doc.number} />
        )}
        {doc.issueDate && <Field label={t(UI.issueDate, lang)} value={doc.issueDate} />}
        {doc.expiryDate && (
          <Field
            label={t(UI.expiryDate, lang)}
            value={`${doc.expiryDate}  ${
              days === null ? '' : days < 0 ? '· ' + t(UI.expiredAgo, lang) : `· ${days} ${t(UI.daysLeft, lang)}`
            }`}
          />
        )}
        {doc.notes && <Field label={t(UI.notes, lang)} value={doc.notes} />}
      </div>

      <div className="rowbtns">
        <button className="ghost" onClick={onEdit}>
          ✏️ {t(UI.edit, lang)}
        </button>
        <button className="ghost danger" onClick={onDelete}>
          🗑️ {t(UI.delete, lang)}
        </button>
      </div>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div className="field">
      <span className="flabel">{label}</span>
      <span className="fvalue">{value}</span>
    </div>
  )
}

// ---- Settings -------------------------------------------------------------
function Settings({ lang, onBack, onReload }) {
  const [hasPin, setHasPin] = useState(!!lsGet(LS_PIN, null))
  const [msg, setMsg] = useState('')
  const restoreRef = useRef(null)

  async function doBackup() {
    const data = await exportAll()
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kaagaz-mitra-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg(t(UI.backupDone, lang))
  }

  async function doRestore(e) {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const data = JSON.parse(await file.text())
      await importAll(data)
      await onReload()
      setMsg(t(UI.restoreDone, lang))
    } catch {
      setMsg('⚠️')
    }
  }

  function togglePin() {
    if (hasPin) {
      lsSet(LS_PIN, null)
      setHasPin(false)
    } else {
      const p = prompt(t(UI.setPin, lang))
      if (p && /^\d{4}$/.test(p)) {
        lsSet(LS_PIN, hashPin(p))
        setHasPin(true)
      }
    }
  }

  return (
    <div className="settings">
      <button className="ghost" onClick={onBack}>
        ← {t(UI.back, lang)}
      </button>
      <h2>⚙️</h2>

      <button className="cta" onClick={doBackup}>
        ⬇️ {t(UI.backup, lang)}
      </button>
      <button className="ghost wide" onClick={() => restoreRef.current?.click()}>
        ⬆️ {t(UI.restore, lang)}
      </button>
      <input ref={restoreRef} type="file" accept="application/json" hidden onChange={doRestore} />

      <button className="ghost wide" onClick={togglePin}>
        🔒 {hasPin ? t(UI.removePin, lang) : t(UI.lock, lang)} {hasPin ? '✓' : ''}
      </button>

      {msg && <p className="okmsg">{msg}</p>}
      <p className="privnote">🔒 {t(UI.privacy, lang)}</p>
    </div>
  )
}
