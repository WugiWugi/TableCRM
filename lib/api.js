const BASE = 'https://app.tablecrm.com/api/v1'

function buildUrl(path, token, params = {}) {
  const url = new URL(`${BASE}${path}`)
  if (token) url.searchParams.set('token', token)
  Object.keys(params).forEach(k => {
    if (params[k] !== undefined && params[k] !== null) url.searchParams.set(k, params[k])
  })
  return url.toString()
}

async function call(path, token, opts = {}) {
  const headers = opts.headers || {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  headers['Content-Type'] = headers['Content-Type'] || 'application/json'
  const res = await fetch(buildUrl(path, token, opts.params), {
    method: opts.method || 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined
  })
  const text = await res.text()
  let json = null
  try { json = text ? JSON.parse(text) : null } catch(e){ json = { raw: text } }
  if (!res.ok) {
    const err = new Error('API Error')
    err.status = res.status
    err.body = json
    throw err
  }
  return json
}

export async function getContragents(token, q) {
  return call('/contragents', token, { params: { q, limit: 20 } })
}

export async function getPayboxes(token) {
  return call('/pboxes/meta/payboxes', token) // attempt meta endpoint; fallback may be needed
}

export async function getOrganizations(token) {
  return call('/organizations', token)
}

export async function getWarehouses(token) {
  return call('/warehouses', token)
}

export async function getPriceTypes(token) {
  return call('/price_types', token)
}

export async function getNomenclature(token, q, page = 1) {
  return call('/nomenclature', token, { params: { q, page, per_page: 20 } })
}

export async function createSale(token, payload) {
  return call('/docs_sales', token, { method: 'POST', body: payload })
}