const Tarea = require("./Tarea");

class Tareas {
    _listado = {};

    // getter que convierte el objeto en un array
    get listadoArr() {
        const listado = [];
        Object.keys(this._listado).forEach(key => {
            const tarea = this._listado[key];
            listado.push(tarea);
        });
        return listado;
    }

    constructor() {
        this._listado = {};
    }

    // borra la tarea que corresponde al id
    borrarTarea = (id = '') => {
        if (this._listado[id]) {
            delete this._listado[id];
        }

    }
    // recibe las tareas y las recorre asignandolas a un objeto
    cargarTareasFromArray(tareas = []) {
        tareas.forEach(tarea => {
            this._listado[tarea.id] = tarea;
        })
    }

    // recibe la tarea desde la consola y la inserta al objeto
    crearTarea(desc = '') {
        const tarea = new Tarea(desc);
        this._listado[tarea.id] = tarea;

    }

    // muestra todas las tareas dansoles un mejor aspecto
    listadoCompleto = () => {
        console.log();
        this.listadoArr.forEach((tarea, i) => {
            const indice = `${i + 1}`.green
            const { desc, completadoEn } = tarea;
            const estado = (completadoEn) ? 'Completada'.green : 'Pendiente'.red;
            console.log(`${indice} ${desc}::${estado}`);
        });


    }

    // dependiendo del parametro que reciba,muestra las tareas completadas o las pendientes
    listarPendientesCompletadas(completadas = true) {
        console.log();
        this.listadoArr.forEach((tarea, i) => {
            const indice = `${i + 1}`.green
            const { desc, completadoEn } = tarea;
            const estado = (completadoEn) ? 'Completada'.green : 'Pendiente'.red;
            if (completadas) {
                if (completadoEn !== null) {
                    console.log(`${indice} ${desc}::${completadoEn.green}`);
                }
                return;
            }


            if (completadoEn == null) console.log(`${indice} ${desc}::${estado}`);



        });
    }


//  cambia el estado entre pendiente y completada y viceversa
    toogleCompletada(ids = []) {
        ids.forEach((id) => {
            const tarea = this._listado[id];
            if (tarea.completadoEn == null) {
                tarea.completadoEn = new Date().toISOString();
            }
        });

        this.listadoArr.forEach((tarea) => {
            if (!ids.includes(tarea.id)) {
                this._listado[tarea.id].completadoEn = null;
            }
        });
    }

}


module.exports = Tareas;