
require('dotenv').config();
const { leerInput, inquirerMenu, pausa, listadoCiudad } = require('./helpers/inquirer');
const Busquedas = require('./models/busquedas');

const main = async () => {
    let opt;
    const busquedas = new Busquedas

    do {
        opt = await inquirerMenu();
        switch (opt) {

            case 1:
                // Mostrar mensaje
                const lugarBuscar = await leerInput('Ciudad: ');
                const lugares = await busquedas.ciudad(lugarBuscar);
                // buscar los lugares
                const idSelec = await listadoCiudad(lugares);
                if (idSelec === '0') continue;

                // seleccionar lugar
                const lugarSel = lugares.find(l => l.id === idSelec);

                busquedas.agregarHistorial(lugarSel.nombre);


                // datos clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng);

                // mostar resultados
                console.log('\nInformacion de la ciudad\n.'.green);
                console.log(`Ciudad: ${lugarSel.nombre}`);
                console.log(`Lat: ${lugarSel.lat}`);
                console.log(`Long: ${lugarSel.lng}`);
                console.log(`Temperatura:${clima.temp} C\u00B0`);
                console.log(`Minima ${clima.temp_min} C\u00B0`);
                console.log(`Maxima ${clima.temp_max} C\u00B0`);
                console.log(`Descripcion: ${clima.desc}`);
                break;

            case 2:
                busquedas.getHistorial.forEach((lugar, i) => {
                    const indice = `${i + 1}`.green
                    console.log(`${indice} ${lugar}`);
                });


                break;

            default:
                break;
        }
        if (opt !== 0) await pausa();
    } while (opt !== 0);

}
main();