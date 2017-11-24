const request = require('request');
const async = require('async');
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
app.get('/sum', (req, res) => {
  log(`QUERY: ${JSON.stringify(req.query)}`);
  var nums = req.query.nums.split(" ");
  async.whilst(
    () => {
      log(`whilst: queue: ${nums.length}`);
      return nums.length > 1
    },
    (cb) => {
      var pairs = [];
      var len = parseInt(nums.length / 2) * 2;
      for (var i = 0; i < len; i += 2) {
        var num1 = nums.shift();
        var num2 = nums.shift();
        pairs.push({
          num1: num1,
          num2: num2
        });
      }
      async.eachLimit(
        pairs,
        50,
        (pair, cb) => {
          doAdder(pair.num1, pair.num2, (err, res) => {
            if (!err) {
              nums.push(res);
            }
            return cb(err);
          });
        }, (err) => {
          return cb(err);
        });
    },
    (err) => {
      if (err) {
        log('got error calling adder: ' + JSON.stringify(err));
      }
      res.send(`From ${myHost}: Sum == ${nums[0]}`);
    }
  );
});

function doAdder(num1, num2, cb) {
  log(`trying to add ${num1} + ${num2}`);
  request(`http://adder:4001/adder?num1=${num1}&num2=${num2}`, (err, res, body) => {
    cb(err, parseInt(JSON.parse(body).result));
  });
}

app.get('/', (req, res) => {
  res.send(`Hello World! from ${myHost}`);
});

module.exports = app.listen(port, () => log(`Example app listening on port ${port}!`));