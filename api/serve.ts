import {VercelRequest, VercelResponse} from '@Vercel/node';
import sqlite3 from 'sqlite3';
import {open} from 'sqlite';

export default function handler(req: VercelRequest, res: VercelResponse){
if(req.method !== 'POST'){
  return res.status(405).json({message:'only POST requests are allowed'})
}

try{
  const db=await open({
    filename: './orders.db',
    driver: sqlite3.Database,
  });

  const {orderId,name,email,address,total,items}=req.body;

  await db.exec(`
  CREATE TABLE IF NOT EXISTS orders(
  id TEXT PRIMARY KEY,
  name TEXT,
  email TEXT,
  address TEXT,
  total REAL,
  created_at TEXT
  );
  `);

 await db.exec(`
  CREATE TABLE IF NOT EXISTS order_items(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id TEXT,
  product_id TEXT,
  name TEXT,
  quantity INTEGER,
  price REAL,
  FOREIGN KEY(order_id) REFERENCES orders(id)
  );
  `);

await db.run(
  'INSERT INTO orders (id,name,email,address,total,created_at) VALUES (?,?,?,?,?,?)',
  [orderId,name,email,address,total,new Date().toISOString()]
);
  
const itemInsert=db.prepare('INSERT INTO order_items (order_id,product_id,name,quantity,price) VALUES (?,?,?,?,?)');
  for (const item of items){
    await itemInsert.run([orderId,item.id,item.name,item.quantity,item.price]);
  }

  res.status(200).json({success:true});
}
  catch (error){
    console.error('Order save error:', error);
    res.status(500).json({error: 'Internal server error'});
  }
  
}
  
  
