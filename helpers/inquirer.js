const inquirer = require('inquirer');

require('colors');

const menuPreguntas = [

    {
        type: 'list',
        name: 'opcion',
        message: '¿Qué desea hacer?',
        choices: [
            {
                value: 1,
                name: `${ '1.'.green} Buscar ciudad.`,
            },

            {
                value: 2,
                name: `${ '2.'.green} Historial.`,
            },

            {
                value: 0,
                name: `${'0.'.green} ${'Salir.'.red}`,
            },

        ],

    },

];

const inquirerMenu = async () => {

    console.clear();

    console.log('============================'.green);
    console.log('   Seleccione una opción'.white);
    console.log('============================\n'.green);

    const {opcion} = await inquirer.prompt(menuPreguntas);

    return opcion

};

const inquirerPausa = async () => {

    const question = [

        {
            type: 'input',
            name: 'enter',
            message: `${'>>'.red} Presione ${'ENTER'.cyan.underline} para continuar.`,
        },

    ];

    return await inquirer.prompt(question);

};

const leerInput = async (mensaje) => {

    const question = [{

        type: 'input',
        name: 'descripcion',
        message: mensaje,
        validate(value) {

            if (value.length === 0) {

                return 'Por favor ingrese una descripción.';
            };

            return true;
        },

    }];

    const {descripcion} = await inquirer.prompt(question);

    return descripcion;

};

const listadoCiudades = async (ciudades = [] ) => {

    const choices = ciudades.map( (ciudad, i) => {

        const index = `${ i + 1}.`.green;

        return {
            value: `${ciudad.id}`,
            name: `${index} ${ciudad.nombre}.`,
        };
        
    });

    choices.unshift({
        value: '0',
        name: `${'0.'.red}` + `${' Cancelar.'.red}`,
        checked: false,
    });
    
    const questions = [
        {
            type: 'list',
            name: 'id',
            message: `${'Seleccione una ciudad'.cyan.underline}:`,
            choices,
        },
    ];

    const {id} = await inquirer.prompt(questions);

    return id;

};

module.exports = {

    inquirerMenu,
    inquirerPausa,
    leerInput,
    listadoCiudades,

};