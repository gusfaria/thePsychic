var express = require('express');
var app  = express();
var fs = require('fs');


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.urlencoded());
app.use(express.json());
app.use(express.methodOverride());
app.use(app.router);
app.use('/public', express.static(__dirname + '/public'));

var imgArray = [];

app.get("/", function(req, res){
  var path = 'public/loaded_imgs/';
  fs.readdir(path, function (err, files) {
    if(err) {
      console.log('error: '+err);
      throw err;
    }
    files.forEach(function(file) {
      var ext = file.substring(file.lastIndexOf('.')+1);
      if(ext === 'png'){
        imgArray.push(path+file);  
      }
    });
    res.render('index',{
      img: imgArray
    });
  });
});

function parseDataURL(body) {
  var match = /data:([^;]+);base64,(.*)/.exec(body);
  if(!match)
    return null;

  return {
    contentType: match[1],
    data: new Buffer(match[2], 'base64')
  };
}

app.post("/uploadImage", function(req, res, next){

    var data= parseDataURL(req.body.image);
    var random_id = "0000" + Math.floor(Math.random() * 10000);
  	fs.writeFile("public/loaded_imgs/test"+ random_id +".png", data.data, function(err) {
  		console.log("error", err);
  	});
});



app.listen(8080);