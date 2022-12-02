const fetch = require('node-fetch');

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  // another common pattern; but there might not be origin (for instance call from browser)
  // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST')
  res.setHeader('Access-Control-Allow-Headers', '*')
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

const handler = async (req, res) => {
  const url = req.query['url'];
  const body = req.body;
  const headers = req.headers;

  console.log(url, body, headers);

  if (url) {
    fetch(url, {
      headers: {
        'Authorization': req.headers['authorization'],
        'Content-Type': req.headers['content-type'],
        'Accept': req.headers['accept']
      },
      body
    })
    .then(result => {
      console.log('Result: ', result)
      return result.json()
    })
    .then(json => {
      console.log('JSON: ', json);
      return res.send(json)
    })
    .catch(e => res.send(e))
  }
}

module.exports = allowCors(handler)
