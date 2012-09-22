
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , nodemailer = require('nodemailer')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});


// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "danmendieta.test@gmail.com",
        pass: "Pruebas1"
    }
});
// Routes

app.get('/', routes.index);
app.post('/', function(req, res){
	var mensajeResponse = "Procesando mensaje...";
	var mensaje = {
		from:req.param('mailde'),
		to:req.param('mailpara'),
		subject:req.param('mailasunto'),
		text:req.param('mailmensaje')
	}
	smtpTransport.sendMail(mensaje, function(error, response){
      if(error){
        mensajeResponse=error;
        console.log(error);	
      }else{
      	console.log(response.message);
        mensajeResponse = response.message;
      }
   });
	res.render('index', { title: 'Node Mail', mensaje:mensajeResponse })
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
