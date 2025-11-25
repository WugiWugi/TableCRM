async function call(route, params = {}) {
  const url = new URL(`/api${route}`, window.location.origin)
  Object.keys(params).forEach(k => {
    if (params[k] !== undefined && params[k] !== null) url.searchParams.set(k, params[k])
  })

  
  const res = await fetch(url.toString())
  const data = await res.json()

  return data
}

export async function getContragents(token, q) {
  return call('/contragents', { token, q, limit: 20 })
}

export async function getPayboxes(token) {
  return call('/pboxes', { token })
}

export async function getOrganizations(token) {
  return call('/organizations', { token })

}

export async function getWarehouses(token) {
  return call('/warehouses', { token })
}

export async function getPriceTypes(token) {
  return call('/price_types', { token })
}

export async function getNomenclature(token, q = '', page = 1) {
  return call('/nomenclature', { token, q, page })
}

export async function createSale(token, payload) {
  return fetch(`/api/docs_sales`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, payload })
  }).then(res => res.json())
}

