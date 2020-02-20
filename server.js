const express = require('express')
const server = express()

// configuration of the static server files
server.use(express.static('public'))

// enable body form
server.use(express.urlencoded({ extended: true}))

//config database connection
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '<password>',
    host: 'localhost',
    port: '5432',
    database: '<database>',
})

//Template engine config
const nunjucks = require('nunjucks')
nunjucks.configure("./", {
    express: server,
    noCache: true,
})
//page apresentation config.
server.get("/", function(req, res) {
    db.query("SELECT * FROM donors" ,function(err, result){
        if (err) return res.send("Erro no banco de dados.")
        
        const donors = result.rows
        return res.render("index.html", { donors })
    })
})

//input form data
server.post("/", function(req, res) {
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if(name == "" || email == "" || blood == ""){
        return res.send("Todos os campos são obrigatórios")
    }

    //push data into database
    const query = `
    INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function(err) {
        //error verification
        if(err) return res.send("erro no banco de dados")

        return res.redirect("/")
    })

})

// turn on server using 3000 port.
server.listen(3000, function() {
    console.log("Server Started.")
})
