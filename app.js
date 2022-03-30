const express = require('express');
const bodyParser = require('body-parser');
let port = process.env.PORT || 5000;

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'))

let items = [];
let workItems = [];

app.get('/', (req, res) => {
     let today = new Date();
     let options = {
          weekday: 'long',
          day: 'numeric',
          month: 'long'
     }

     let day = today.toLocaleDateString('en-US', options);


     res.render('list', {listTitle: day, newListItems: items});
})

app.post('/', (req, res) => {
     let item = req.body.newItem;

     if (req.body.list == 'Work') {
          workItems.push(item)
          res.redirect('/work')
     } else {
          items.push(item)
          res.redirect('/')
     }
})

app.get('/work', (req, res) => {
     res.render('list', {listTitle: 'Work List', newListItems: workItems})
})


app.listen(port, () => {
     console.log(`server listening on port 5K`);
})