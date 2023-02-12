const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const ejs=require("ejs");
const app=express();
app.use(express.static("public"));
app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
mongoose.connect("mongodb://localhost:27017/wikiKaDB",{useNewUrlParser:true});
const ArticleSchema={
    title:String,
    content:String
};
const Article=mongoose.model("Article",ArticleSchema);
app.route("/articles").get(function(req,res){
    Article.find(function(err,FoundList){
        res.send(FoundList);
    })
}).post(function(req,res){
    var arttitle=req.body.title;
    var artcontent=req.body.content;
    const newArticle=new Article({
       title:arttitle,
       content:artcontent 
    });
    newArticle.save(function(err){
        if(!err){
            res.send("created sucesfully")
        }
        else{
            console.log(err);
        }
    })
}).delete(function(req,res){
    Article.deleteMany(function(err){
      if(!err){
        res.send("deleted sucessfully");
      }  
    })
    });

app.route("/articles/:articleTitle").get(function(req,res){
    Article.findOne({title:req.params.articleTitle},function(err,foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }
    })
}).put(function(req,res){
    Article.replaceOne({title:req.params.articleTitle},{title:req.body.title,content:req.body.content},function(err){
    if(!err){
        res.send("updated sucessfully");
    }
})}).patch(function(req,res){
    Article.updateOne({title:req.params.articleTitle},{$set:req.body},function(err){
    if(!err){
        res.send("Sucesfully updated!!");
    }
    })
}).delete(function(req,res){
    Article.deleteOne({title:req.params.articleTitle},function(err){
        if(!err){
            res.send("Deleted sucessfully");
        }
    })
})

app.listen(3000,function(req,res){
    console.log("listenning to port 3000");    
})