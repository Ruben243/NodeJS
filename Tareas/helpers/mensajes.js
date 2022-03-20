require('colors');


const mostrarMenu = () => {

    return new Promise(resolve => {
        console.clear();
        console.log('=================================='.green);
        console.log(' Seleccione una opcion  '.green);
        console.log('==================================\n'.green);
        console.log(`${'1'.green} Crear Treas`);
        console.log(`${'2'.green} Mostar areas`);
        console.log(`${'3'.green} MostrarTareas Completadas`);
        console.log(`${'4'.green} Mostar areas Pendientes`);
        console.log(`${'5'.green} Marcar omo Completada`);
        console.log(`${'6'.green} Borrar area`);
        console.log(`${'0'.green} Salir\n`);

        const readLine = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readLine.question('Seleccione una opciones ', (opt) => {
            readLine.close();
            resolve(opt);
        });

    });

} //Lave de mostrarMenu

const pausa = () => {
    return new Promise(resolve => {
        const readLine = require('readline').createInterface({
            input: process.stdin,
            output: process.stdout
        });

        readLine.question(`\nPresione ${'ENTER'.green} para continuar\n`, (opt) => {
            readLine.close();
            resolve();
        });
    });
}//Pausa









module.exports = {
    mostrarMenu,
    pausa
}