import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

const conn = await mysql.createConnection({
  uri: 'mysql://root:Admin_1jj395qu@localhost:3306/ecommerce',
  multipleStatements: true
});

const sql = fs.readFileSync(path.join(process.cwd(), 'docs', 'insert_data_ecom_example.sql'), 'utf8');
await conn.query(sql);
console.log('Data inserted successfully');

const [rows] = await conn.query("SELECT 'categories' as tbl, COUNT(*) as cnt FROM categories UNION ALL SELECT 'products', COUNT(*) FROM products UNION ALL SELECT 'product_images', COUNT(*) FROM product_images UNION ALL SELECT 'customers', COUNT(*) FROM customers UNION ALL SELECT 'orders', COUNT(*) FROM orders UNION ALL SELECT 'order_items', COUNT(*) FROM order_items");
rows.forEach(r => console.log(r.tbl + ': ' + r.cnt + ' rows'));

await conn.end();
