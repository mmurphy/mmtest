const express = require('express');
const app = express();

const port = 4000;
var shouldFail = false;

const myHost = process.env.HOSTNAME;

function log(str) {
  const when = (new Date()).toISOString();
  console.log(`${when}: ${myHost}: ${str}`);
}

app.get('/sys/ready', (req, res) => {
  if (shouldFail) {
    log(`returning NOT ready`);
    res.sendStatus(500);
  } else {
    res.json({
      'status': 'ok'
    });
  }
});
app.get('/sys/fail', (req, res) => {
  log('setting readiness FAIL mode');
  shouldFail = true;
  res.json({
    'status': 'ok'
  })
});
app.get('/sys/fix', (req, res) => {
  log('setting readiness FIX mode');
  shouldFail = false;
  res.json({
    'status': 'ok'
  })
});
app.get('/', (req, res) => {
  res.send(`Hello World! from ${myHost}`);
});

app.listen(port, () => log(`Example app listening on port ${port}!`));