"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadProducts = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const xml2js_1 = require("xml2js");
const loadProducts = async () => {
    const filePath = path_1.default.join(__dirname, '../../public/products.xml');
    const xml = fs_1.default.readFileSync(filePath, 'utf-8');
    const result = await (0, xml2js_1.parseStringPromise)(xml);
    const items = result.VFPData.que_txt;
    return items.map((item) => {
        const id = item.sloupec01?.[0] ?? '';
        // Соберём массив изображений из папки public/obrazky/{id}
        const obrazkyDir = path_1.default.join(__dirname, `../../public/obrazky/${id}`);
        let images = [];
        if (fs_1.default.existsSync(obrazkyDir)) {
            const files = fs_1.default
                .readdirSync(obrazkyDir)
                .filter((f) => f.toLowerCase().startsWith('image'));
            // Подготовим URL-ы для фронта
            images = files.map((f) => `/obrazky/${id}/${f}`);
        }
        // Главное изображение — первый из списка (если есть)
        const image = images[0] ?? '';
        return {
            id,
            name: item.sloupec02?.[0] ?? '',
            price: parseFloat((item.sloupec03?.[0] ?? '0').replace(',', '.')),
            vat: parseFloat((item.sloupec04?.[0] ?? '0').replace(',', '.')),
            category: item.sloupec06?.[0] ?? '',
            weight: parseFloat((item.sloupec07?.[0] ?? '0').replace(',', '.')),
            unitsPerPackage: parseFloat((item.sloupec08?.[0] ?? '0').replace(',', '.')),
            unitsPerPalette: parseFloat((item.sloupec09?.[0] ?? '0').replace(',', '.')),
            quantity: parseFloat((item.sloupec11?.[0] ?? '0').replace(',', '.')),
            description: item.sloupec12?.[0] ?? '',
            desc1: item.sloupec13?.[0] ?? '',
            desc2: item.sloupec14?.[0] ?? '',
            desc3: item.sloupec15?.[0] ?? '',
            desc4: item.sloupec16?.[0] ?? '',
            image, // ✔️ уже нормальный путь
            images, // ✔️ массив путей
        };
    });
};
exports.loadProducts = loadProducts;
