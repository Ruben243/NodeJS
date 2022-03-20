require('colors');
const Tareas = require('./models/Tareas');
const { guardarDb, leerDb } = require('./helpers/guardarArchivo');
const { inquirerMenu, pausa, leerInput, listadoTareasBorrar, confirmar,
        seleccionCompletar } = require('./helpers/inquirer');

const main = async () => {
    let opt = '';
    const tareas = new Tareas();
    const tareasDb = leerDb();
    if (tareasDb) tareas.cargarTareasFromArray(tareasDb);
    do {
        opt = await inquirerMenu();
        switch (opt) {
            case '1':
                // crear opcion
                const desc = await leerInput('descripcion');
                tareas.crearTarea(desc);
                guardarDb(tareas.listadoArr);

                break;
            case '2':
                // mostra tareas
                if (tareasDb) tareas.listadoCompleto();
                break;
            case '3':
                // mostar completadas
                if (tareasDb) tareas.listarPendientesCompletadas(true);
                break;
            case '4':
                // mostar pendientes
                if (tareasDb) tareas.listarPendientesCompletadas(false);
                break;

            case '5':
                // marcar como completadas
                const ids = await seleccionCompletar(tareas.listadoArr);
                tareas.toogleCompletada(ids);
                const Tdata = [...tareas.listadoArr];
                guardarDb(Tdata);

                break;

            case '6':
                // borrar
                if (tareasDb) {
                    const id = await listadoTareasBorrar(tareas.listadoArr);
                    if (id !== '0') {
                        const siOno = await confirmar('Estas seguro?');
                        if (siOno) tareas.borrarTarea(id);
                        console.log('tarea Borrada');
                        //Crea un array temporal sin la tarea borrada.
                        const Tdata = [...tareas.listadoArr];
                        // El array temporal sobre escribe el json sin la tarea
                        guardarDb(Tdata);

                    }
                }
                break;
            default:
                console.log('Fin del progama');
                break;
        }


        if (opt !== '0') await pausa();
    } while (opt !== '0');
}




main();
