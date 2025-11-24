import { useState, useEffect, useRef } from 'react'
import { getContragents } from '../lib/api'

export default function ClientSearch({ token, contragent, setContragent }) {
  const [q, setQ] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const timer = useRef(null)

  useEffect(()=> {
    if (!q) { setList([]); return }
    if (!token) return
    clearTimeout(timer.current)
    timer.current = setTimeout(async ()=>{
      setLoading(true)
      try {
        const res = await getContragents(token, q)
        // assume res.data or res.items; adapt defensively
        const items = res?.data || res?.items || res?.contragents || res || []
        setList(Array.isArray(items) ? items : [])
      } catch(e){
        setList([])
      } finally { setLoading(false) }
    }, 350)
    return ()=>clearTimeout(timer.current)
  }, [q, token])

  return (
    <div className="card">
      <div className="h1">Клиент</div>
      <input className="input" placeholder="Телефон или имя" value={q} onChange={e=>setQ(e.target.value)} />
      <div className="small">Выбранный: {contragent?.title || contragent?.name || contragent?.phone || '—'}</div>
      <div className="select-list">
        {loading && <div className="loader">Поиск...</div>}
        {!loading && list.length===0 && <div className="small-muted" style={{padding:8}}>Результаты не найдены</div>}
        {list.map((c, idx)=>(
          <div key={idx} className="item" onClick={()=>setContragent(c)}>
            <div style={{fontWeight:600}}>{c.title || c.name || c.full_name || c.phone || '№'+(c.id||'')}</div>
            <div className="small-muted">{c.phone || c.inn || ''}</div>
          </div>
        ))}
      </div>
    </div>
  )
}