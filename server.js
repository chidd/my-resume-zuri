const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require("body-parser");
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

dotenv.config({path:'config.env'});
const PORT = process.env.PORT || 8080;
const PASSWORD = process.env.PASSWORD || '';

//log requests
app.use(morgan('tiny'));

// parse request to body-parser
app.use(bodyparser.urlencoded({extended:true}))

// set view engine
app.set("view engine", "ejs")
// app.set("views", path.resolve(__dirname,"views/ejs"))

//MIDDLEWARE
app.use(express.json()); //to recieve formdata
// load assets
app.use("/assets", express.static(__dirname + "/assets"));
// app.use('/css', express.static(path.resolve(__dirname,"assets/css")))
// app.use('/img', express.static(path.resolve(__dirname,"assets/img")))
// app.use('/js', express.static(path.resolve(__dirname,"assets/js")))
// app.use(express.static("assets"));


app.get('/', (req,res)=>{
    res.render('index');
})

app.post('/',(req, res)=>{
    console.log(req.body);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user: 'chinedu@geekict.com.ng',
            pass: PASSWORD
        }
    })

    const mailOptions  = {
        from: req.body.nodemailer,
        to: 'chinedu@geekict.com.ng',
        subject: `Message from ${req.body.email}: ${req.body.subject}`,
        text: req.body.message
    }

    transporter.sendMail(mailOptions,(error, info)=>{
        if(error){
            console.log(error);
            res.send('error');
        }else{
            console.log('Email sent: ' + info.response);
            res.send('Success');
        }
    })
})

app.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`)
})