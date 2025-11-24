export default function Cart({ items, updateItem, removeItem }) {
  const total = items.reduce((s,i)=>s + i.price * i.qty, 0)
  return (
    <div className="card">
      <div className="h1">Корзина</div>
      <div className="cart-list">
        {items.length===0 && <div className="small-muted" style={{padding:8}}>Пусто</div>}
        {items.map((it, idx)=>(
          <div key={idx} className="cart-row">
            <div style={{flex:1}}>
              <div style={{fontWeight:700}}>{it.name}</div>
              <div className="small-muted">₽{Number(it.price).toFixed(2)}</div>
            </div>
            <div className="qty">
              <button onClick={()=>updateItem(idx, Math.max(1, it.qty-1))}>−</button>
              <div>{it.qty}</div>
              <button onClick={()=>updateItem(idx, it.qty+1)}>+</button>
              <button onClick={()=>removeItem(idx)} style={{marginLeft:8}}>✕</button>
            </div>
          </div>
        ))}
      </div>
      <div className="total">
        <div className="small-muted">Итого</div>
        <div>₽{total.toFixed(2)}</div>
      </div>
    </div>
  )
}