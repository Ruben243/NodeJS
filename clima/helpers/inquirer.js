const inquirer = require('inquirer');
require('colors');

// array de opciones para el menu interactivo
const preguntas = [{
    type: 'list',
    name: 'opcion',
    message: '¿Qué desea hacer?',
    choices: [
        {
            value: 1,
            name: `${'1.'.red} Buscar Ciudad`
        },
        {
            value: 2,
            name: `${'2.'.red} Historial`
        },
        {
            value: 0,
            name: `${'0.'.red} Salir`
        },

    ]
}];


// menu que muestra en consola las opciones
const inquirerMenu = async () => {

    console.clear();
    console.log('=================================='.green);
    console.log(' Seleccione una opcion'.white);
    console.log('==================================\n'.green);

    const { opcion } = await inquirer.prompt(preguntas);

    return opcion;
}

// pausa el programa 
const pausa = async () => {
    const pregunta = [{
        type: 'input',
        name: 'enter',
        message: `Presione ${'ENTER'.green} para continuar\n`,
    }]
    console.log('\n');

    await inquirer.prompt(pregunta);


}

// recibe la informacion desde la consola y retorna la descripcion
const leerInput = async (message) => {
    const question = [{
        type: 'input',
        name: 'desc',
        message,
        validate(value) {
            if (value.length === 0) {
                return 'Por favor ingrese un valor';
            }
            return true;
        }

    }]
    const { desc } = await inquirer.prompt(question);

    return desc;
}


//  muestra las tareas para que decidamos cual queremos borrar
const listadoCiudad = async (lugares = []) => {
    const choices = lugares.map((lugar, i) => {
        const indice = `${i + 1}`.green
        return {
            value: lugar.id,
            name: `${indice} ${lugar.nombre}`
        }
    })
    choices.unshift({
        value: '0',
        name: '0'.green + ' Cancelar',
    })
    const preguntas = [{
        type: 'list',
        name: 'id',
        message: 'Seleccione Lugar',
        choices

    }]
    const { id } = await inquirer.prompt(preguntas);
    return id;
}

// pide confirmacion para borrar
const confirmar = async (message) => {
    const question = [{
        type: 'confirm',
        name: 'ok',
        message
    }]
    const { ok } = await inquirer.prompt(question);
    return ok;
}

// muestra las tareas para marcar como completadas,indicando cuales estan ya completas
const seleccionCompletar = async (tareas = []) => {
    const choices = tareas.map((tarea, i) => {
        const indice = `${i + 1}`.green;
        return {
            value: tarea.id,
            name: `${indice} ${tarea.desc}`,
            checked: (tarea.completadoEn) ? true : false,
        }
    })

    const pregunta = [{
        type: 'checkbox',
        name: 'ids',
        message: 'Seleccione',
        choices

    }]
    const { ids } = await inquirer.prompt(pregunta);
    return ids;
}
module.exports = {
    inquirerMenu,
    pausa,
    leerInput,
    listadoCiudad,
    confirmar,
    seleccionCompletar
}