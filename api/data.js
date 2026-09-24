export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const JSONBIN_KEY = "$2a$10$cmR.OJ9OgytXFIQjNCR3o.ScH572wakolkRZOIuMnwB8gZNArqd3G";
  const JSONBIN_BIN = "6aab2dfcac6210605ad676ae";
  const JSONBIN_URL = "https://api.jsonbin.io/v3/b/" + JSONBIN_BIN;
  
  try {
    // ============ GET ============
    if (req.method === 'GET') {
      const r = await fetch(JSONBIN_URL + "/latest", {
        headers: { "X-Access-Key": JSONBIN_KEY, "X-Bin-Meta": "false" }
      });
      const data = await r.json();
      return res.status(200).json(data);
    }
    
    // ============ PUT (با محافظت از پاک شدن) ============
    if (req.method === 'PUT') {
      // ۱. آخرین نسخه رو از سرور بگیر
      const getRes = await fetch(JSONBIN_URL + "/latest", {
        headers: { "X-Access-Key": JSONBIN_KEY, "X-Bin-Meta": "false" }
      });
      const currentData = await getRes.json();
      const newData = req.body;
      
      // ۲. ادغام هوشمند
      const merged = mergeData(currentData, newData);
      
      // ۳. ذخیره
      const r = await fetch(JSONBIN_URL, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json", 
          "X-Access-Key": JSONBIN_KEY 
        },
        body: JSON.stringify(merged)
      });
      const data = await r.json();
      return res.status(200).json(data);
    }
    
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}

// ============ تابع ادغام ============
function mergeData(oldData, newData) {
  if (!oldData || !oldData.users) return newData;
  if (!newData || !newData.users) return oldData;
  
  const oldUsers = oldData.users || [];
  const newUsers = newData.users || [];
  
  // کاربران قدیمی که توی new نیستن → احتمالا پاک شدن → نگهشون دار
  const newIds = {};
  newUsers.forEach(u => { newIds[u.id] = true; });
  
  // کاربران جدید که توی old نبودن → اضافه کن
  const oldIds = {};
  oldUsers.forEach(u => { oldIds[u.id] = true; });
  
  // نتیجه نهایی
  const finalUsers = [];
  
  // همه کاربران جدید رو اضافه کن
  newUsers.forEach(u => { finalUsers.push(u); });
  
  // کاربران قدیمی که توی new نیستن رو هم اضافه کن
  oldUsers.forEach(u => {
    if (!newIds[u.id]) {
      finalUsers.push(u);
    }
  });
  
  // نتیجه
  return {
    ...oldData,
    ...newData,
    users: finalUsers
  };
  }
