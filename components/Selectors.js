import { useState, useEffect } from 'react'
import { getPayboxes, getOrganizations, getWarehouses, getPriceTypes, getContragents, getNomenclature } from '../lib/api'

function SelectorBlock({ title, fetcher, token, value, onChange }) {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!token) return
    let mounted = true
    setLoading(true)

    fetcher(token)
      .then(res => {
        if (!mounted) return
        let items = []
        if (Array.isArray(res?.result)) items = res.result
        else if (Array.isArray(res?.data)) items = res.data
        else if (Array.isArray(res)) items = res
        setList(items)
      })
      .catch(() => setList([]))
      .finally(() => setLoading(false))

    return () => { mounted = false }
  }, [token, fetcher])

  return (
    <div className="card">
      <div
        className="h1"
        style={{ cursor: 'pointer' }}
        onClick={() => setOpen(!open)}
      >
        {title}
      </div>

      {open && (
        <div className="select-list">
          {loading && <div className="loader">Загрузка...</div>}
          {!loading && list.length === 0 && <div className="small-muted" style={{ padding: 8 }}>Нет данных</div>}
          {list.map((it, i) => (
            <div
              key={i}
              className="item"
              onClick={() => { onChange(it); setOpen(false) }}
              style={{ background: value?.id === it.id ? 'rgba(6,182,212,0.08)' : undefined }}
            >
              <div style={{ fontWeight: 600 }}>
                {it.short_name || it.full_name || it.work_name || it.name || it.title || it.id}
              </div>
              <div className="small-muted">
                {it.inn ? `ИНН: ${it.inn}` : (it.phone || it.code || '')}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="small">
        Выбрано: {value?.short_name || value?.full_name || value?.work_name || value?.name || value?.title || value?.id || '—'}
      </div>
    </div>
  )
}

export default function Selectors({
  token,
  paybox, setPaybox,
  organization, setOrganization,
  warehouse, setWarehouse,
  priceType, setPriceType,
  contragent, setContragent,
  items, setItems
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  return (
    <>
      {/* Контрагент как обычный SelectorBlock */}
      <SelectorBlock
        title="Контрагент"
        fetcher={(t) => getContragents(t, searchTerm)}
        token={token}
        value={contragent}
        onChange={setContragent}
      />

      <SelectorBlock title="Счета (Payboxes)" fetcher={getPayboxes} token={token} value={paybox} onChange={setPaybox} />
      <SelectorBlock title="Организации" fetcher={getOrganizations} token={token} value={organization} onChange={setOrganization} />
      <SelectorBlock title="Склады" fetcher={getWarehouses} token={token} value={warehouse} onChange={setWarehouse} />
      <SelectorBlock title="Типы цен" fetcher={getPriceTypes} token={token} value={priceType} onChange={setPriceType} />
      <SelectorBlock
        title="Товары"
        fetcher={(t) => getNomenclature(t, searchTerm)}
        token={token}
        value={selectedItem}
        onChange={item => {
          setSelectedItem(item)
          if (item && !items.find(i => i.id === item.id)) {
            setItems([{ ...item, qty: 1, price: item.prices?.[0]?.price || 0 }, ...items])
          }
        }}
      />
    </>
  )
}