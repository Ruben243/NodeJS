const axios = require('axios');
const fs = require('fs');

class Busquedas {
    historial = [];
    dbPath = './db/database.json';

    constructor() {
        // TODO leer db si existe
    }

    get paramsMapBox() {
        return {
            'access_token': process.env.MAPBOX_KEY || 'Sin key',
            'limit': 5,
            'language': 'es',
        }
    }
    get paramsOPEN() {
        return {
            'appid': process.env.OPENWEATHER_KEY || 'Sin key',
            'units': 'metric',
            'lang': 'ES'


        }

    }

    get getHistorial() {
        this.leerDb();
        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map(p => p[0].toUpperCase() + p.substring(1));
            return palabras.join(' ');
        });

    }
    async ciudad(lugar = '') {
        try {
            // peticion http
            const instance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json?`,
                params: this.paramsMapBox,
            })

            const res = await instance.get();
            return res.data.features.map(lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1],
            }));

        } catch (error) {
            return []// retornar los lugares 

        }
    }

    async climaLugar(lat, lon) {
        try {
            // instamcia
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather?`,
                params: { ...this.paramsOPEN, lat, lon },
            })

            // respuesta
            const respuesta = await instance.get();
            const { weather, main } = respuesta.data;
            return {
                desc: weather[0].description,
                temp_min: main.temp_min,
                temp_max: main.temp_max,
                temp: main.temp
            }
        } catch (error) {
            console.log(error);

        }

    }

    agregarHistorial(lugar = '') {
        // prevenir duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return;
        }
        this.historial = this.historial.splice(0.5);
        this.historial.unshift(lugar.toLocaleLowerCase());
        this.guardarDb();


    }
    guardarDb() {
        const payload = {
            historial: this.historial,
        }
        fs.writeFileSync(this.dbPath, JSON.stringify(payload))
    }

    leerDb() {
        if (!fs.existsSync(this.dbPath)) {
            return null;
        }
        const info = fs.readFileSync(this.dbPath, { encoding: 'utf-8' });
        //Controlar cuando el archvo esta vacio
        if (info.length == 0) {
            return null;
        }
        const data = JSON.parse(info);
        this.historial = data.historial;


    }

}


module.exports = Busquedas;