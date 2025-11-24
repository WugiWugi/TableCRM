import { useState, useEffect, useRef } from 'react'
import { getNomenclature } from '../lib/api'

export default function ProductSearch({ token, priceType, onAdd }) {
  const [q, setQ] = useState('')
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(false)
  const timer = useRef(null)

  useEffect(()=>{
    if (!q) { setList([]); return }
    if (!token) return
    clearTimeout(timer.current)
    timer.current = setTimeout(async ()=>{
      setLoading(true)
      try {
        const res = await getNomenclature(token, q)
        const items = res?.data || res?.items || res?.nomenclature || res || []
        setList(Array.isArray(items) ? items : [])
      } catch(e){
        setList([])
      } finally { setLoading(false) }
    }, 350)
    return ()=>clearTimeout(timer.current)
  }, [q, token])

  return (
    <div className="card">
      <div className="h1">Товары</div>
      <input className="input" placeholder="Поиск товара" value={q} onChange={e=>setQ(e.target.value)} />
      <div className="select-list">
        {loading && <div className="loader">Поиск...</div>}
        {!loading && list.length===0 && <div className="small-muted" style={{padding:8}}>Результаты не найдены</div>}
        {list.map((it, idx)=>(
          <div key={idx} className="item" onClick={()=>{
            const price = (it.prices && it.prices[priceType?.id || 0]) || it.price || it.price_default || 0
            onAdd({
              id: it.id || it.nomenclature_id,
              name: it.title || it.name || it.nom,
              qty: 1,
              price: Number(price) || 0
            })
          }}>
            <div style={{fontWeight:600}}>{it.title || it.name || it.nom}</div>
            <div className="small-muted">{it.code ? 'Артикул: '+it.code : ''}</div>
          </div>
        ))}
      </div>
    </div>
  )
}