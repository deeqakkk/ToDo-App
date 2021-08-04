const express = require("express");
const app = express();

app.use(express.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.use(express.json());
app.set('view engine', 'ejs');


let addItem = "";
let day = "";
let addItems = ["Buy Food", "Cook Food", "Eat Food"];
let workItems = [];

app.get("/", function (req, res) {
    let today = new Date();
    let options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    };
    let day = today.toLocaleDateString("en-US", options);
    res.render("list", {
        listTitle: day,
        newListItems: addItems
    });
});

app.post("/", function (req, res) {
    let addItem = req.body.newItem;
    addItems.push(addItem);
    res.redirect("/");
});

app.get("/work", function (req, res) {
    res.render("list", {
        listTitle: "Work List",
        newListItems: workItems
    })
})

app.post("/work", function (req, res) {
    let item = req.body.newItem;
    console.log(req.body.list);
    if (req.body.list === "Work List") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        addItem.push(item);
        res.redirect("/");
    }

})
app.listen(3000, function () {
    console.log("Server started on port 3000");
});