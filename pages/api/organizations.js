export default async function handler(req, res) {
  const token = req.query.token
  const response = await fetch(`https://app.tablecrm.com/api/v1/organizations?token=${token}`)
  const data = await response.json()
  res.status(200).json(data)
}