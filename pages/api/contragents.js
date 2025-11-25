export default async function handler(req, res) {
  const token = req.query.token
  const q = req.query.q || ''
  const response = await fetch(`https://app.tablecrm.com/api/v1/contragents?token=${token}&q=${q}&limit=20`)
  const data = await response.json()
  res.status(200).json(data)
}