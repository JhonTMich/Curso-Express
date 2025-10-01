require('dotenv').config();
const express = require('express');
const {validateUser} = require('./utils/validation');
const bodyParser = require('body-parser')

const fs = require('fs');
const path = require('path');
const usersFilePath = path.join(__dirname, 'users.json');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

const PORT = process.env.PORT || 3000;
console.log(PORT);

app.get('/', (req,res)=>{
    res.send(`
        <h1>Curso Express.js</h1>
        <p>Esto es una aplicacion feita node.js xd con express.js p</p>
        <p>Corriendose en el puerto: ${PORT}</p>
        `)
}); 

app.get('/users/:id',(req, res)=>{
    const userId = req.params.id;
    res.send(`Info del usuario con ID: ${userId}`)
})

app.get('/search',(req, res)=>{
    const terms = req.query.termino || 'No especificado';
    const category = req.query.categoria || 'Todas';

    res.send(`
        <h2>Resultados de Busqueda:</h2>
        <p>Termino: ${terms}</p>
        <p>Categoria: ${category}</p>
        `)

})

app.post('/form',(req,res)=>{
    const name = req.body.nombre || 'Anonimo';
    const email = req.body.email || 'No dado';

    res.json({
        message: 'Datos recibidos patron',
        data: {
            name,
            email
        }
    })
})

app.post('/api/data',(req,res)=>{
    const data = req.body;

    if(!data || Object.keys(data).length === 0){
        return res.status(400).json({error: 'No recibi nada choy'});
    }

    res.status(201).json({
        message: 'Datos JSON recibidos choy',
        data
    });

})

app.get('/users', (req,res)=>{
    fs.readFile(usersFilePath, 'utf-8',(err,data)=>{
        if (err){
            return res.status(500).json({error:'Error de conexion de datos'})
        }
        const users = JSON.parse(data);
        res.json(users);
    })
})

app.post('/users', (req,res)=>{
    const newUser = req.body;
    fs.readFile(usersFilePath,'utf-8',(err,data)=>{
        if(err){
            return res.status(500).json({error: 'Error con conexion de datos'});
        }
        const users = JSON.parse(data);
        const validation = validateUser(newUser, users, false);
        if(!validation.isValid){
            return res.status(400).json({error: validation.error});
        }

        users.push(newUser);
        fs.writeFile(usersFilePath, JSON.stringify(users,null, 2),err =>{
            if(err){
                return res.status(500).json({error: 'Error al guardar datos del usuario'});
            }
            res.status(201).json(newUser);
        });
    });
});

app.put('/users/:id',(req,res)=>{
    const userId = parseInt(req.params.id,10);
    const updatedUser = req.body;

    fs.readFile(usersFilePath,'utf-8',(err,data)=>{
        if(err){
            return res.status(500).json({error: 'Error con conexion de datos'});
        }
        let users = JSON.parse(data);

        const validation = validateUser(updatedUser, users, true);
        if(!validation.isValid){
            return res.status(400).json({error: validation.error});
        }

        const userIndex = users.findIndex(user => user.id === userId);
        if(userIndex === -1){
            return res.status(404).json({error: 'Usuario no encontrado'});
        }
        
        users[userIndex] = {...users[userIndex], ...updatedUser};

        fs.writeFile(usersFilePath, JSON.stringify(users,null, 2),err =>{
            if(err){
            return res.status(500).json({error: 'Error al actualizar datos'});
        }
    });  
});
});

app.delete('/users/:id',(req,res)=>{
    const userId = parseInt(req.params.id,10);
    fs.readFile(usersFilePath,'utf-8',(err,data)=>{
        if(err){
            return res.status(500).json({error: 'Error con conexion de datos'});
        }
        let users = JSON.parse(data);
        users = users.filter(user => user.id !== userId);
        fs.writeFile(usersFilePath, JSON.stringify(users,null, 2),err =>{
            if(err){
            return res.status(500).json({error: 'Error al eliminar usuario'});
        }
        res.status(204).send();
    });
    })
})

app.listen(PORT, ()=>{
    console.log(`Servidor : http://localhost:${PORT}`);
})