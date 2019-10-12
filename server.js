var express = require('express');
var app = express();

app.use(express.urlencoded({extended: true}));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/animals', {useNewUrlParser:true, useUnifiedTopology: true});
var animalSchema = new mongoose.Schema({
    name: {type: String, required: true},
    img: {type: String, required: true}
});

mongoose.model('Animal', animalSchema);
var animal = mongoose.model('Animal');


app.get('/',function(req,res){
    var allAnimals = animal.find({})
    .then((data)=>{res.render('index', {allAnimals:data})})
    .catch((error)=>{console.log(error)});
    
});

app.get('/mongooses/new', function(req,res){
    res.render('new');
})
app.post('/mongooses/new', function(req, res){
    console.log("Post Data", req.body);
    animal.create(req.body);
    console.log('create animal');
    res.redirect('/');
})
app.get('/mongooses/:id', function(req, res){
    
    animal.find({_id:req.params.id}, function(err, animal){
        if(err){
            console.log(err);
        }else{
            res.render('show',{findAnimal: animal[0]});
        }
    });
});

app.get('/mongooses/edit/:id', function(req, res){
    animal.find({_id:req.params.id}, function(err, animal){
        if(err){console.log(err);}
        else{
            console.log(animal)
            res.render('edit',{myAnimal: animal[0]});
        }
    });
});

app.post('/mongooses/edit/:id',function(req, res){
    console.log(req.body);
    animal.updateOne({_id:req.params.id}, req.body,function(err, result){
        if(err){console.log(err);}
        else{res.redirect('/');}
    });
});

app.get('/mongooses/destroy/:id', function(req,res){
    animal.findByIdAndRemove({_id:req.params.id}, function(err){
        if(err){console.log(err);}
        else{res.redirect('/');}
    });
});


app.listen(8000, function() {
    console.log('listen on port 8000');
})