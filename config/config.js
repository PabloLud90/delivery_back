// // Si quieres seguir usando Bluebird (opcional)
// const Bluebird = require('bluebird');
// global.Promise = Bluebird; // hace que todas las promesas usen Bluebird

// Inicializa pg-promise
const pgp = require('pg-promise')({
  query: (e) => {
    // Puedes agregar logs o debugging aquí
    // console.log('Consulta ejecutada:', e.query);
  }
});

// Configuración de PostgreSQL
const databaseConfig = {
  host: '127.0.0.1',
  port: 5432,
  database: 'db_delivery',
  user: 'postgres',
  password: 'root'
};

// Crea la instancia de conexión
const db = pgp(databaseConfig);

// Configura el parser para timestamps (opcional)
const types = pgp.pg.types;
types.setTypeParser(1114, (stringValue) => stringValue);

// Exporta la conexión correctamente
module.exports = db;
