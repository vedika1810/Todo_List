//jshint esversion:6

//ps - haven't seen vid 346,347,348

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose'); //db
const { redirect } = require("express/lib/response");

const app = express();

app.set('view engine', 'ejs');

const date = require(__dirname + "/date.js");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//mongoose.connect('mongodb://localhost:27017/todolistDB') ->local connection

//WITH MONGODB ATLAS (CLOUD DB) password-Vedika@1810 -> @ = %40
mongoose.connect('mongodb+srv://admin-Vedika:Vedika%401810@cluster0.4chyh.mongodb.net/todolistDB?retryWrites=true&w=majority');
  
//db2 (making schema)
const itemsSchema = {
  name : String
};

//db3 (mongoose model)
const Item = mongoose.model("Item",itemsSchema);

//db4 3docs 
const item1 = new Item({
  name : "Welcome to your todolist!"
});
const item2 = new Item({
  name : "Hit the + button to add a new item"
});
const item3 = new Item({
  name : "<-- Hit this to delete an item"
});

//array to store default items above 
const defaultItems = [item1,item2,item3];

app.get("/", function(req, res) {

  //sending items to list.ejs from db
  Item.find({}, function(err,foundItems){
    //if no items in list add default items else render list.ejs  
    if(foundItems.length === 0)
    {
      Item.insertMany(defaultItems,function(err){
        if(err){
          console.log(err);
        }
        else{
          console.log("Successfulyy saved default items into DB.");
        }
      });
      //redirect once default is entered
      res.redirect("/");
    }

    else{

      const day = date.getDate();
      res.render("list", {listTitle:day, newListItems: foundItems});
    }
    
  });

});

//adding items from form 
app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item =new Item({
    name : itemName
  });

  item.save();

  //to show item in list 
  res.redirect("/");

});

//deleting items from db
app.post("/delete" , function(req,res){
  const checkedItemId = req.body.checkbox; 
  Item.findByIdAndRemove(checkedItemId,function(err){
    if(!err)
    {
      res.redirect("/");
    }
  });
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

//heroku port 
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port);

app.listen(port, function() {
  console.log("Server has started successfully!");
});
