export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const JSONBIN_KEY = "$2a$10$cmR.OJ9OgytXFIQjNCR3o.ScH572wakolkRZOIuMnwB8gZNArqd3G";
  const JSONBIN_BIN = "6aab2dfcac6210b5ad676ae";
  const JSONBIN_URL = "https://api.jsonbin.io/v3/b/" + JSONBIN_BIN;
  
  try {
    if (req.method === 'GET') {
      const r = await fetch(JSONBIN_URL + "/latest", {
        headers: { "X-Access-Key": JSONBIN_KEY, "X-Bin-Meta": "false" }
      });
      const data = await r.json();
      return res.status(200).json(data);
    }
    
    if (req.method === 'PUT') {
      const r = await fetch(JSONBIN_URL, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          "X-Access-Key": JSONBIN_KEY 
        },
        body: JSON.stringify(req.body)
      });
      const data = await r.json();
      return res.status(200).json(data);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
        }
