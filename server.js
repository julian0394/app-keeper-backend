const express = require('express'); /* Busca el modulo express el las dependencias del paquete json. */
const bcrypt = require('bcrypt'); 
const cors = require('cors');
const knex = require('knex');

const app = express(); /* Representa el modulo express derivado de la funcion. */

app.use(express.json());
app.use(cors());

const db = knex({
  client: 'mysql',
  connection: {
    host : '127.0.0.1', // = localhost
    user : 'root',
    password : 'password',
    database : 'keeper-app-db'
  }
});

// db.select('*').from('usuarios').then( data => {
//     console.log(data)
// });   

const database = { 
  usuarios: [
    {
      id: '1',
      nombreUsuario: 'shuli',
      mailUsuario: 'shuli@app.com',
      password: 'pancasero',
      fechaRegistro: new Date(),
      cantNotas: 0,   
    },
    {
      id: '2',
      nombreUsuario: 'lombardi',
      mailUsuario: 'lombardi@app.com',
      password: 'tete',
      fechaRegistro: new Date(),
      cantNotas: 0,   
    }
  ]
};

app.get('/', (req, res) => {
  res.send(database.usuarios);
});
/* Establece la accion cuando un externo hace un pedido a nuestro servidor. */

app.get('/usuario/:id', (req, res) => {
  const {id} = req.params;
  let usuarioEncontrado = false;
  database.usuarios.forEach( usuario => {
    if(usuario.id === id) { 
      usuarioEncontrado = true;
      return res.json(usuario);
    }
  });
  if(!usuarioEncontrado)
    res.status(404).json('No se encontró el usuario solicitado');
});

app.post('/login', (req, res) => {
  console.log('req:', req.body);
  if(req.body.usuario === database.usuarios[0].nombreUsuario && 
    req.body.password === database.usuarios[0].password) {
      console.log(database.usuarios[0]);
      res.json(database.usuarios[0]);
  } else {
    res.status(400).json('Error al logearse');
  }
}); 

app.post('/register', (req, res) => {
  const {usuario, email, password} = req.body;
  db('usuarios')
    .returning('*')
    .insert({
      nombreUsuario: usuario,
      mailUsuario: email,
      cantNotas: 0,
      fechaRegistro: calcularFecha()
    })
    .then(user => {
      res.json(user[0]);
    })
    .catch( err => res.status(404).json('El usuario o correo ya existe'))
}); 

/* Escucha el puerto establecido para pedidos http hacia nuestro servidor, 
  2do parametro especifica una acción cuando el server inicia. */

  // bcrypt.genSalt(10, function(err, salt) {
  //   bcrypt.hash('juli', salt, function(err, hash) {
  //     console.log(hash);
  //     hashLoco(hash);
  //   });
  // });
    
  // function hashLoco(hash) {
  //   bcrypt.compare('juli', hash, function(err, result) {
  //     console.log(hash);
  //     console.log(result);
  //     if(result)
  //       console.log('dice juli');
  //     else
  //       console.log('no dice juli');
  //   });
  // }

function calcularFecha() {
  let fecha = new Date(),
    mes = String(fecha.getMonth() + 1),
    dia = String(fecha.getDate()),
    anio = fecha.getFullYear();

  if (mes.length < 2) 
    mes = '0' + mes;
  if (dia.length < 2) 
    dia = '0' + dia;

  const fechaHoy = [anio, mes, dia].join('-');
  return fechaHoy;
} 

app.listen( process.env.PORT || 3030, () => console.log("Servidor -J- iniciado") ); 
/*  process.env.PORT es para el servidor de heroku una vez que este subido a esa web */