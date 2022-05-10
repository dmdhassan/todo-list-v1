const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const _ = require('lodash');
let port = process.env.PORT || 5000;

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))

mongoose.connect('mongodb+srv://admin-hassan:Hassan1104@cluster0.r4qky.mongodb.net/todoListDB');

const itemsSchema = new mongoose.Schema({
     name: String
})

const Item = mongoose.model('Item', itemsSchema);

const item1 = new Item({
     name: 'Welcome to your todo list'
})

const item2 = new Item({
     name: 'Hit the + button to add a new item'
})

const item3 = new Item({
     name: '<<< Click this to cancel an item'
})

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
     name: String,
     items: [itemsSchema]
})

const List = mongoose.model('List', listSchema);

// let today = new Date();
// let options = {
//      weekday: 'long',
//      day: 'numeric',
//      month: 'long'
// }
// let day = today.toLocaleDateString('en-US', options);

app.get('/', (req, res) => {
     
     Item.find({}, (err, foundItem) => {

          if (foundItem.length === 0) {
               Item.insertMany(defaultItems, (err) => {
                    if (err) {
                    console.log(err)
                    } else {
                         console.log('You have successfully added the data');
                    }
               })

               res.redirect('/')
          } else {

               res.render('list', {listTitle: 'Today', newListItems: foundItem});
          }
     })


})

app.post('/', (req, res) => {
     const itemName = req.body.newItem;
     const listName = req.body.list;

     const item = new Item({
     name: itemName
     })

     if (listName === 'Today') {
          item.save()
          res.redirect('/')
     } else {
          List.findOne({name: listName}, (err, foundList) => {
               if (!err) {
                    foundList.items.push(item);
                    foundList.save()

                    res.redirect('/' + listName)
               } else {
                    console.log(err);
               }
          })
     } 

})

app.post('/delete', (req, res) => {
     let checkedItemId = req.body.checkbox;
     let listName = req.body.listName

     if (listName === 'Today') {
          Item.findByIdAndRemove(checkedItemId, (err) => {
          if (err) {
               console.log(err);
          } else {
               console.log('Successfully deleted');
          }
          res.redirect('/')
     });
     } else {
          List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList) => {
               if (!err) {
                    res.redirect('/' + listName)
               }
          })
     }

})

app.get('/:newList', (req, res) => {
     const newList = _.capitalize(req.params.newList);

     List.findOne({name: newList}, (err, foundList) => {
          
          if (!err) {
               if (!foundList) {
                    const list = new List({
                         name: newList,
                         items: defaultItems 
                    })

                    list.save()
                    res.redirect(`/${newList}`)
               } else {
                    res.render('list', {listTitle: newList, newListItems: foundList.items });
               }
          }
     })


})


app.listen(port, () => {
     console.log(`server listening on port 5K`);
})