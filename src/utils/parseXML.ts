import fs from 'fs'
import path from 'path'
import { parseStringPromise } from 'xml2js'
import { Product } from '../types/Product'
export const loadProducts = async (): Promise<Product[]> => {
	const filePath = path.join(__dirname, '../../public/products.xml')
	const xml = fs.readFileSync(filePath, 'utf-8')
	const result = await parseStringPromise(xml)
	const items = result.VFPData.que_txt

	return items.map((item: any): Product => {
		const id = item.sloupec01?.[0] ?? ''

		// Соберём массив изображений из папки public/obrazky/{id}
		const obrazkyDir = path.join(__dirname, `../../public/obrazky/${id}`)
		let images: string[] = []

		if (fs.existsSync(obrazkyDir)) {
			const files = fs
				.readdirSync(obrazkyDir)
				.filter((f) => f.toLowerCase().startsWith('image'))

			// Подготовим URL-ы для фронта
			images = files.map((f) => `/obrazky/${id}/${f}`)
		}

		// Главное изображение — первый из списка (если есть)
		const image = images[0] ?? ''

		return {
			id,
			name: item.sloupec02?.[0] ?? '',
			price: parseFloat((item.sloupec03?.[0] ?? '0').replace(',', '.')),
			vat: parseFloat((item.sloupec04?.[0] ?? '0').replace(',', '.')),
			category: item.sloupec06?.[0] ?? '',
			weight: parseFloat((item.sloupec07?.[0] ?? '0').replace(',', '.')),
			unitsPerPackage: parseFloat(
				(item.sloupec08?.[0] ?? '0').replace(',', '.')
			),
			unitsPerPalette: parseFloat(
				(item.sloupec09?.[0] ?? '0').replace(',', '.')
			),
			quantity: parseFloat((item.sloupec11?.[0] ?? '0').replace(',', '.')),
			description: item.sloupec12?.[0] ?? '',
			desc1: item.sloupec13?.[0] ?? '',
			desc2: item.sloupec14?.[0] ?? '',
			desc3: item.sloupec15?.[0] ?? '',
			desc4: item.sloupec16?.[0] ?? '',
			image, // ✔️ уже нормальный путь
			images, // ✔️ массив путей
		}
	})
}
