import { useState } from 'react'
import TokenInput from '../components/TokenInput'
import ClientSearch from '../components/ClientSearch'
import Selectors from '../components/Selectors'
import ProductSearch from '../components/ProductSearch'
import Cart from '../components/Cart'
import { createSale } from '../lib/api'

export default function Home(){
  const [token, setToken] = useState('')
  const [contragent, setContragent] = useState(null)
  const [paybox, setPaybox] = useState(null)
  const [organization, setOrganization] = useState(null)
  const [warehouse, setWarehouse] = useState(null)
  const [priceType, setPriceType] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  function addItem(item){
    // merge by id
    const idx = items.findIndex(i=>i.id===item.id)
    if (idx===-1) setItems([item, ...items])
    else {
      const copy = [...items]
      copy[idx].qty += item.qty
      setItems(copy)
    }
  }
  function updateItem(idx, qty){
    const copy = [...items]; copy[idx].qty = qty; setItems(copy)
  }
  function removeItem(idx){
    const copy = [...items]; copy.splice(idx,1); setItems(copy)
  }

  function validate(){
    if (!token) { setError('Токен обязателен'); return false }
    if (!paybox) { setError('Выберите счёт (paybox)'); return false }
    if (!organization) { setError('Выберите организацию'); return false }
    if (!warehouse) { setError('Выберите склад'); return false }
    if (!priceType) { setError('Выберите тип цен'); return false }
    if (items.length===0) { setError('Добавьте хотя бы один товар'); return false }
    setError(null)
    return true
  }

  async function submit(conduct=false){
    if (!validate()) return
    setLoading(true)
    setResult(null)
    setError(null)
    try {
      const payload = {
        contragent_id: contragent?.id || null,
        paybox_id: paybox?.id,
        organization_id: organization?.id,
        warehouse_id: warehouse?.id,
        price_type_id: priceType?.id,
        items: items.map(it=>({
          nomenclature_id: it.id,
          quantity: it.qty,
          price: it.price
        })),
        total: items.reduce((s,i)=>s + i.qty * i.price, 0),
        conduct: !!conduct
      }
      const res = await createSale(token, payload)
      setResult(res)
    } catch(e){
      setError(e?.body || e?.message || 'Неизвестная ошибка')
    } finally { setLoading(false) }
  }

  return (
    <div className="container">
      <TokenInput token={token} setToken={setToken} />
      <ClientSearch token={token} contragent={contragent} setContragent={setContragent} />
      <Selectors
        token={token}
        paybox={paybox} setPaybox={setPaybox}
        organization={organization} setOrganization={setOrganization}
        warehouse={warehouse} setWarehouse={setWarehouse}
        priceType={priceType} setPriceType={setPriceType}
      />
      <ProductSearch token={token} priceType={priceType || {}} onAdd={addItem} />
      <Cart items={items} updateItem={updateItem} removeItem={removeItem} />
      <div style={{marginBottom:20}} className="card">
        <div className="actions">
          <button className="btn ghost" onClick={()=>submit(false)} disabled={loading}>Создать</button>
          <button className="btn primary" onClick={()=>submit(true)} disabled={loading}>Создать и провести</button>
        </div>
        {loading && <div className="small-muted" style={{marginTop:8}}>Отправка...</div>}
        {error && <div className="small-muted" style={{marginTop:8,color:'#ffb4b4'}}>{typeof error==='string'?error:JSON.stringify(error)}</div>}
        {result && <div className="small-muted" style={{marginTop:8,color:'#b2ffd6'}}>Успех: {JSON.stringify(result)}</div>}
        <div className="footer-note">Примечание: поле token добавляется к каждому запросу. Тестируйте на тестовом токене.</div>
      </div>
    </div>
  )
}