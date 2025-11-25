export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end() // только POST
  const token = req.body.token
  const payload = req.body.payload

  const response = await fetch(`https://app.tablecrm.com/api/v1/docs_sales?token=${token}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  const data = await response.json()
  res.status(200).json(data)
}