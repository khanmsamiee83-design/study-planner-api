export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  
  const KEY = "$2a$10$Ci0wkaa4MfKwFkairLQVee7kYfyZcSm.lnEo2lxWx5zQCm480Drdi";
  const BIN = "6ad2418fffdf5d16053714d82";
  const URL = "https://api.jsonbin.io/v3/b/" + BIN;
  
  try {
    if (req.method === 'GET') {
      const r = await fetch(URL + "/latest", {
        headers: { "X-Master-Key": KEY, "X-Bin-Meta": "false" }
      });
      return res.status(200).json(await r.json());
    }
    
    if (req.method === 'PUT') {
      const r = await fetch(URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-Master-Key": KEY },
        body: JSON.stringify(req.body)
      });
      return res.status(200).json(await r.json());
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
