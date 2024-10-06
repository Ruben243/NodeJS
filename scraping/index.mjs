// Importamos la función 'firefox' de la biblioteca Playwright
import { firefox } from "playwright";

// Iniciamos una instancia del navegador Firefox en modo headless (sin interfaz gráfica)
const browser = await firefox.launch(
    { headless: true }
)

// Creamos una nueva página en el navegador
const pagina = await browser.newPage();

// Navegamos a la URL de búsqueda de Amazon para "one piece"
await pagina.goto(
    ""
)

// Extraemos información de los productos en la página
const prodcutos = await pagina.$$eval(
    '.s-card-container',
    (results) => (
        results.map((el) => {
            console.log(results);

            // Extraemos el título del producto
            const title = el.querySelector('h2')?.innerText

            console.log(title);

            // Si no hay título, saltamos este producto
            if (!title) return null

            // Extraemos la URL de la imagen del producto
            const imagen = el.querySelector('img').getAttribute('src')

            // Extraemos el precio del producto
            const price = el.querySelector('.a-price .a-offscreen')?.innerText

            // Extraemos el enlace del producto
            const link = el.querySelector('.a-link-normal').getAttribute('href')

            // Retornamos un objeto con la información del producto
            return { title, imagen, price, link }
        })
    )
)

// Imprimimos la información de los productos en la consola
console.log(prodcutos);

// Cerramos el navegador
await browser.close()