const path = require('path');
const express = require('express')
const logger = require('morgan');
const app = express()
const methodOverride = require('method-override')
const { engine } = require('express-handlebars');
const port = 3000

const db = require('./config/db');
const route = require('./routes/index');


db.connect();


app.use(logger('dev'));
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());
app.use(methodOverride('_method'))

app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    helpers: {
      sum: (a,b) => a + b,
      for: function(from, to, incr, block) {
        var accum = '';
        for(var i = from; i < to; i += incr)
            accum += block.fn(i);
        return accum;
    }
    }
  }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources/views'));



// app.get('/', (req, res) => {
//   res.render('home')
// })
// app.get('/name', (req, res) => {
//     var temp = req.query.value;
//     console.log(temp) ;
//     res.status(200);
//     res.send('Nhiet do: ' + temp)
// })

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})