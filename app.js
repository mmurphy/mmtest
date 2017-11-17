const express = require('express');
const app = express();

const port = 4000;
var shouldFail = false;

app.get('/sys/ready', (req, res) => {
  if (shouldFail) {
    res.sendStatus(500);
  } else {
    res.json({
      'status': 'ok'
    });
  }
});
app.get('/sys/fail', (req, res) => {
  shouldFail = true;
  res.json({
    'status': 'ok'
  })
});
app.get('/sys/fix', (req, res) => {
  shouldFail = false;
  res.json({
    'status': 'ok'
  })
});
app.get('/', (req, res) => {
  res.send(`Hello World! from ${process.env.HOSTNAME}`);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));