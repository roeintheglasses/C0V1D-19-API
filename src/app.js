const express = require('express');
const routes = require('./routes');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors())
app.use('/api', routes);
app.get('*', (_, res) => res.send('Page Not found'));

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}!`);
});