require ( 'dotenv' ).config();

require('colors');

const Busquedas = require('./models/busquedas');

const {leerInput, inquirerMenu, inquirerPausa, listadoCiudades,} = require('./helpers/inquirer');

const main = async () => {

    let opcion;

    const busquedas = new Busquedas;

    do {

        opcion = await inquirerMenu();

        switch(opcion) {

            case 1:

                let terminoBusqueda = await leerInput('Ciudad:');

                let ciudades = await busquedas.ciudades(terminoBusqueda);

                while (ciudades.length === 0) {

                    terminoBusqueda = await leerInput('Ciudad:');

                    ciudades = await busquedas.ciudades(terminoBusqueda);

                };

                console.log();

                const idCiudad = await listadoCiudades(ciudades);

                if (idCiudad === '0') continue;

                const ciudadSeleccionada = ciudades.find( ciudad => ciudad.id === idCiudad );

                busquedas.agregarHistorial(ciudadSeleccionada.nombre);

                const clima = await busquedas.climaCiudades(ciudadSeleccionada.lat, ciudadSeleccionada.lng);

                console.clear();
                console.log(`${'\nInfomación de la ciudad'.cyan.underline}:\n`);
                console.log(`${'Ciudad'.green.underline}: ${ciudadSeleccionada.nombre}.`);
                console.log(`${'Lat'.green.underline}: ${ciudadSeleccionada.lat}.`);
                console.log(`${'Lng'.green.underline}: ${ciudadSeleccionada.lng}.`);
                console.log(`${'Estado del clima'.green.underline}: ${clima.estado}.`);
                console.log(`${'Temperatura'.green.underline}: ${clima.temperatura}°C.`);
                console.log(`${'Sensación térmica'.green.underline}: ${clima.sensacionTermica}°C.`);
                console.log(`${'Mínima'.green.underline}: ${clima.minima}°C.`);
                console.log(`${'Máxima'.green.underline}: ${clima.maxima}°C`);
                console.log(`${'Presión'.green.underline}: ${clima.presion}hPa.`);
                console.log(`${'Humedad'.green.underline}: ${clima.humedad}%.`);
                console.log(`${'Viento'.green.underline}: ${clima.viento}m/s.`);
                console.log(`${'Visibilidad'.green.underline}: ${(clima.visibilidad)}Km.`);

            break;
            
            case 2:

                console.log();

                busquedas.gethistorialCapitalizado.forEach( (ciudad, i) => {

                    const index = `${ i + 1}.`.green;

                    console.log(`${index} ${ciudad}.`);

                });
             
            break;

        };

        if (opcion !== 0) {

            console.log();

            await inquirerPausa();

        };

    } while ( opcion !== 0) { 
        
        console.clear() 
    };

};

main();