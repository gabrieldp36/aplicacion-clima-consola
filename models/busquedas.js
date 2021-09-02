const fs = require('fs');

require ( 'dotenv' ).config();

const axios = require('axios');

class Busquedas {

    historial = [];

    dbPath = './db/database.json';

    constructor() {

        this.leerDB();

    };

    get gethistorialCapitalizado() {

        // return this.historial.map( ciudad => {

        //     return ciudad.replace( /(^|[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ])([a-záéíóúüñ])/g, caracter => caracter.toUpperCase() );

        // });

        return this.historial.map( ciudad => {

            let palabras = ciudad.split(' ');

            palabras = palabras.map( palabra => palabra[0].toUpperCase() + palabra.substring(1) );
            
            return palabras.join(' ');

        });

    };

    get getParamsMapbox () {

        return { 
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es',
        };

    };

    get getParamsOpenWeather () {

        return {
            'appid': process.env.OPENWHEATHER_KEY,
            'units': 'metric',
            'lang': 'es'
        };

    };

    async ciudades (terminoBusqueda = '') {

        try {

            const instance = axios.create({

                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${terminoBusqueda}.json`,

                params: this.getParamsMapbox,
                
            });

            const response = await instance.get();

            if (response.data.features.length === 0) {
            
                console.log(`\n${'No se ha encontrado una ciudad con el nombre ingresado'.red}.\n\n${'Por favor ingrese una nueva búsqueda'.green}.\n`);

                return [];

            } else {

                return response.data.features.map( ciudad => {

                    return {
                        id: ciudad.id,
                        nombre: ciudad.place_name,
                        lng: ciudad.center[0],
                        lat: ciudad.center[1],
                    };

                });
            };

        } catch (error){

            return console.log(`\n${'No se ha encontrado una ciudad con el nombre ingresado'.red}.\n`);

        };

    };

    async climaCiudades (lat, lon) {

        try{

            const instance = axios.create({

                baseURL: 'https://api.openweathermap.org/data/2.5/weather',
                params: {...this.getParamsOpenWeather, lat, lon},

            });

            const response = await instance.get();

            const {weather, main, wind, visibility} = response.data;

            return {
                estado: weather[0].description,
                temperatura: main.temp,
                sensacionTermica: main.feels_like,
                minima: main.temp_min, 
                maxima: main.temp_max,
                presion: main.pressure,
                humedad: main.humidity,
                viento: wind.speed,
                visibilidad: visibility/1000
            };

        } catch (error) {

            return console.log(`\n${'No se ha encontrado una ciudad con el nombre ingresado'.red}.\n`);

        };

    };

    agregarHistorial (ciudad = '') {

        if ( this.historial.includes( ciudad.toLocaleLowerCase() ) ) {

            return;
        };
        
        this.historial = this.historial.splice(0,7);

        this.historial.unshift( ciudad.toLocaleLowerCase() );

        this.guardaDB();

    };

    guardaDB() {

        const payLoad = {

            historial: this.historial,
        };

        fs.writeFileSync( this.dbPath, JSON.stringify(payLoad) );

    };

    leerDB() {

        if ( !fs.existsSync(this.dbPath) ) return;
        
        const info = fs.readFileSync( this.dbPath, {encoding:'utf-8'} );

        const data = JSON.parse(info);

        this.historial = data.historial;
        
    };



};

module.exports = Busquedas;