import { Router } from 'express'
import { loadProducts } from '../utils/parseXML'
const router = Router()

router.get('/categories/list', async (req, res) => {
	try {
		const products = await loadProducts()

		const categories = Array.from(new Set(products.map((p) => p.category)))

		res.json(categories)
	} catch (err) {
		console.error('Ошибка при получении категорий:', err)
		res.status(500).json({ message: 'Ошибка сервера' })
	}
})

router.get('/', async (req, res) => {
	const { category, search } = req.query
	const products = await loadProducts()

	const filtered = products.filter((p) => {
		if (category && p.category !== category) return false
		if (
			search &&
			!p.name.toLowerCase().includes((search as string).toLowerCase())
		)
			return false
		return true
	})

	res.json(filtered)
})

router.get('/:id', async (req, res) => {
	const products = await loadProducts()
	const found = products.find((p) => p.id === req.params.id)
	if (!found) return res.status(404).json({ message: 'Not found' })
	res.json(found)
})

export default router
