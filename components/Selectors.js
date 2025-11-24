import { useState, useEffect } from 'react'
import { getPayboxes, getOrganizations, getWarehouses, getPriceTypes } from '../lib/api'

function SelectorBlock({title, fetcher, token, value, onChange}) {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  useEffect(()=>{
    if (!token) return
    let mounted = true
    setLoading(true)
    fetcher(token).then(res=>{
      if (!mounted) return
      const items = res?.data || res?.items || res || []
      setList(Array.isArray(items) ? items : [])
    }).catch(()=>setList([])).finally(()=>setLoading(false))
    return ()=>{ mounted=false }
  }, [token, fetcher])

  return (
    <div className="card">
      <div className="h1">{title}</div>
      <div className="select-list">
        {loading && <div className="loader">Загрузка...</div>}
        {!loading && list.length===0 && <div className="small-muted" style={{padding:8}}>Нет данных</div>}
        {list.map((it, i)=>(
          <div key={i} className="item" onClick={()=>onChange(it)} style={{background: value?.id===it.id ? 'rgba(6,182,212,0.08)' : undefined}}>
            <div style={{fontWeight:600}}>{it.title || it.name || it.id}</div>
            <div className="small-muted">{it.code || it.alias || ''}</div>
          </div>
        ))}
      </div>
      <div className="small">Выбрано: {value?.title || value?.name || value?.id || '—'}</div>
    </div>
  )
}

export default function Selectors(props){
  const { token, paybox, setPaybox, organization, setOrganization, warehouse, setWarehouse, priceType, setPriceType } = props
  return (
    <>
      <SelectorBlock title="Счета (Payboxes)" fetcher={getPayboxes} token={token} value={paybox} onChange={setPaybox} />
      <SelectorBlock title="Организации" fetcher={getOrganizations} token={token} value={organization} onChange={setOrganization} />
      <SelectorBlock title="Склады" fetcher={getWarehouses} token={token} value={warehouse} onChange={setWarehouse} />
      <SelectorBlock title="Типы цен" fetcher={getPriceTypes} token={token} value={priceType} onChange={setPriceType} />
    </>
  )
}