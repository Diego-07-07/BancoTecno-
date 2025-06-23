// importar los frameworks necesarios para ejecutar la app
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

// crear una instancia de la aplicación express
const app = express();
const PORT = process.env.PORT || 3000; // USA EL PUERTO QUE ASIGNE RAILWAY O LOCAL 3000

// habilitar CORS para permitir peticiones
app.use(cors());

// permite a express entender el formato JSON
app.use(bodyParser.json());

// detectar archivos estáticos en la carpeta public
app.use(express.static('public'));

    // CONEXIÓN A MONGODB ATLAS USANDO VARIABLE DE ENTORNO
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('CONECTADO A MONGODB ATLAS'))
.catch(err => console.error('ERROR DE CONEXIÓN:', err));

.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error(err));

// Esquemas y modelos
const usuarioSchema = new mongoose.Schema({
    nombre: String,
    email: String,
    password: String,
});
const Usuario = mongoose.model('Usuario', usuarioSchema);

const prestamoSchema = new mongoose.Schema({
    Cantidad: Number,
    Plazo_de_Pago: String
});
const Prestamo = mongoose.model('Prestamo', prestamoSchema);

const empleadoSchema = new mongoose.Schema({
    nombre: String,
    rol: String
});
const Empleado = mongoose.model('Empleado', empleadoSchema);

const clienteSchema = new mongoose.Schema({
    cliente: String,
    direccion: String
});
const Cliente = mongoose.model('Cliente', clienteSchema);

const cuentaSchema = new mongoose.Schema({
    Numero_Cuenta:Number,
    Tipo_Cuenta:String
});
const Cuenta = mongoose.model('Cuenta', cuentaSchema);

const deudorSchema =new mongoose.Schema({
    Nombre: String,
    Cantidad: Number
});
const Deudor = mongoose.model('Deudor', deudorSchema );

// Ruta para registrar un nuevo usuario
app.post('/registro', async (req, res) => {
    try {
        const { nombre, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const nuevoUsuario = new Usuario({ nombre, email, password: hashedPassword });
        await nuevoUsuario.save();
        res.status(201).send('Usuario registrado');
    } catch (err) {
        res.status(500).send('Error al registrar usuario');
    }
});

// Ruta de login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({ email });
        if (!usuario) return res.status(401).send('Usuario no encontrado');

        const valid = await bcrypt.compare(password, usuario.password);
        if (!valid) return res.status(401).send('Contraseña incorrecta');

        res.send('Bienvenido ' + usuario.nombre);
    } catch (err) {
        res.status(500).send('Error en el inicio de sesión');
    }
});

// CRUD Prestamos
app.get('/api/prestamos', async (req, res) => {
    const prestamos = await Prestamo.find();
    res.json(prestamos);
});

app.post('/api/prestamos', async (req, res) => {
    const nuevo = new Prestamo(req.body);
    await nuevo.save();
    res.status(201).send('Prestamo agregado');
});

app.delete('/api/prestamos/:id', async (req, res) => {
    await Prestamo.findByIdAndDelete(req.params.id);
    res.send('Prestamo eliminado');
});

// CRUD Empleados
app.get('/api/empleados', async (req, res) => {
    const empleados = await Empleado.find();
    res.json(empleados);
});

app.post('/api/empleados', async (req, res) => {
    const nuevo = new Empleado(req.body);
    await nuevo.save();
    res.status(201).send('Empleado creado');
});

app.delete('/api/empleados/:id', async (req, res) => {
    await Empleado.findByIdAndDelete(req.params.id);
    res.send('Empleado eliminado');
});

// Ruta para obtener los datos de los clientes
app.get('/api/clientes', async (req, res) => {
    const clientes = await Cliente.find();
    res.json(clientes);
});

// Ruta para crear un nuevo cliente
app.post('/api/clientes', async (req, res) => {
    const { cliente, direccion } = req.body;
    const nuevo = new Cliente({ cliente, direccion });
    await nuevo.save();
    res.status(201).send('Cliente registrado');
});
// Ruta para eliminar un cliente por su ID
app.delete('/api/clientes/:id', async (req, res) => {
    await Cliente.findByIdAndDelete(req.params.id);
    res.send('Cliente eliminado');
});

// Ruta para obtener todas las cuentas
app.get('/api/cuentas', async (req, res) => {
    const cuentas = await Cuenta.find();
    res.json(cuentas);
});

// Ruta para crear una nueva cuenta
app.post('/api/cuentas', async (req, res) => {
    const nuevo = new Cuenta(req.body);
    await nuevo.save();
    res.status(201).send('Cuenta registrada');
});

// Ruta para eliminar una cuenta por su ID
app.delete('/api/cuentas/:id', async (req, res) => {
    await Cuenta.findByIdAndDelete(req.params.id);
    res.send('Cuenta eliminada');
});

// Ruta para obtener todas los Deudores
app.get('/api/deudores', async (req, res) => {
    const deudores = await Deudor.find();
    res.json(deudores);
});

// Ruta para crear una nueva Deuda
app.post('/api/deudores', async (req, res) => {
    const nuevo = new Deudor(req.body);
    await nuevo.save();
    res.status(201).send('Deudor registrada');
});

// Ruta para eliminar una Deuda por su ID
app.delete('/api/deudores/:id', async (req, res) => {
    await Deudor.findByIdAndDelete(req.params.id);
    res.send('Deudor eliminada');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
