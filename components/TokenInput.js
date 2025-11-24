import { useState } from 'react'

export default function TokenInput({ token, setToken }) {
  const [local, setLocal] = useState(token || '')
  return (
    <div className="card">
      <div className="header">
        <div>
          <div className="h1">Токен кассы</div>
          <div className="small">Введите токен для авторизации API-запросов</div>
        </div>
      </div>
      <div style={{marginTop:8}}>
        <input
          className="input"
          placeholder="token..."
          value={local}
          onChange={e=>setLocal(e.target.value)}
        />
        <div style={{display:'flex',gap:8,marginTop:8}}>
          <button className="btn primary" onClick={()=>setToken(local)}>Установить</button>
          <button className="btn ghost" onClick={()=>{setLocal(''); setToken('')}}>Очистить</button>
        </div>
      </div>
    </div>
  )
}