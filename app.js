const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const date=require(__dirname+"/date.js");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.use(express.json());
app.set('view engine', 'ejs');


let addItem = "";
let dayName = "";
let taskList = ["Internships", "Practice DSA", "Complete WebDev"];
let workList = ["Work List"];

app.get("/", function (req, res) {
    let day=date();
    res.render("list", {
        listTitle: day,
        newListItems: taskList
    });
});

app.get("/work", function (req, res) {
        res.render("list", {
        listTitle:"Work List",
        newListItems: workList
    });
});

app.post("/work", function (req, res) {
     
    let item = req.body.newItem;
    
    if (req.body.list === "Work") {
        workList.push(item);
        res.redirect("/work");
    } 
    else {
        taskList.push(item);
        res.redirect("/");
    }
});
app.get("/about", function(req,res){
    res.render("about");
})
app.listen(3000, function () {
    console.log("Server started on port 3000");
});