import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import productsRouter from './routes/products'

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())

app.use('/api/products', productsRouter)

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`)
})
