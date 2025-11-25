export default async function handler(req, res) {
  const token = req.query.token
  const search = req.query.q || ''
  const page = Number(req.query.page || 1)
  const limit = 20
  const offset = (page - 1) * limit

  const response = await fetch(
    `https://app.tablecrm.com/api/v1/nomenclature/?token=${token}&name=${search}&barcode=${search}&limit=${limit}&offset=${offset}`
  )

  const data = await response.json()
  res.status(200).json(data)
}