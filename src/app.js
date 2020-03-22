const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const compression = require('compression')

const PORT = process.env.PORT || 3000;

const app = express();
app.use(compression())
app.use(cors())
app.use('/api', routes);
app.get('*', (_, res) => res.send('Page Not found'));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});