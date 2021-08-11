const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const _=require("lodash");
const app = express();
const date = require(__dirname + "/date.js");

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
app.use(express.json());
app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://deeqakkk:password@cluster0.p9dze.mongodb.net/todoListDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// SCHEMA FOR DEFAULT ITEMS
const itemSchema = new mongoose.Schema({
    todoTask: String
});
// SCHEMA MODEL
const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({
    todoTask: "Github Me:@deeqakkk"
});
const item2 = new Item({
    todoTask: "Hit '+' to add a new task"
});
const item3 = new Item({
    todoTask: "Check to clear"
});
const defaultItems = [item1, item2, item3];

// LIST SCHEMA FOR ROUTE PARAMETERS
const listSchema = {
    name: String,
    items: [itemSchema]
};
const List = mongoose.model("List", listSchema);

let day = date();
day = "Today";

app.get("/", function (req, res) {
    Item.find(function (err, itemsFound) {
        if (itemsFound.length == 0) {
            Item.insertMany(defaultItems, function (err) {
                if (err)
                    console.log(err);
                else console.log("Inserted default items successfully!");
            });
            res.redirect("/");

        } else
            res.render("list", {
                listTitle: day,
                newListItems: itemsFound
            });
    });

});

app.get("/:RouteName", function (req, res) {
    const customListName = _.capitalize(req.params.RouteName);
    
    List.findOne({
        name: customListName
    }, function (err, foundList) {
        if (!err) {
            if (!foundList) {
                const list = new List({
                    name: customListName,
                    items: defaultItems
                });
                list.save();
                res.redirect("/" + customListName);
            } else
                res.render("list", {
                    listTitle: foundList.name,
                    newListItems: foundList.items
                });
        }
    })
});

app.post("/", function (req, res) {
    let itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        todoTask: itemName
    });

    if (listName === "Today") {
        item.save();
        res.redirect("/");
    } else {
        List.findOne({
            name: listName
        }, function (err, foundList) {
            if (!err) {
                foundList.items.push(item);
                foundList.save();
                res.redirect("/" + listName);
            } else console.log("!not found");
        })
    }
});

app.post("/delete", function (req, res) {
    const checkBoxID = req.body.checkBox;
    const listName = req.body.listName;
    if (listName === "Today") {
        Item.deleteOne({
            _id: checkBoxID
        }, function (err) {
            if (!err) {
                console.log("Successfully Deleted!");
                res.redirect("/");
            }
        });
    } else {
        List.findOneAndUpdate({
            name: listName
        }, {
            $pull: {
                items: {
                    _id: checkBoxID
                }
            }
        }, function (err, foundList) {
            if (!err) {
                res.redirect("/" + listName);
            }
        })

    }

});


app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(process.env.PORT);
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,function(){
    console.log("Sever running on port 30000");
});

