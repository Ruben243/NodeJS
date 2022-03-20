const fs = require('fs');
const archivo = './db/data.json';


// guarda los datoscomo un string en un archivo
const guardarDb = (data) => {
    fs.writeFileSync(archivo, JSON.stringify(data));
}


// leer el archivo y lo convierte un string en un objeto.Luego lo retorna
const leerDb = () => {
    if (!fs.existsSync(archivo)) {
        return null;
    }
    const info = fs.readFileSync(archivo, { encoding: 'utf-8' });
    //Controlar cuando el archvo esta vacio
    if (info.length==0) {
        return null;
    }
    const data = JSON.parse(info);
    return data;


}



module.exports = {
    guardarDb,
    leerDb
}