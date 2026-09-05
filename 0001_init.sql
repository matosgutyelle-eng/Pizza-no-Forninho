CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price REAL NOT NULL DEFAULT 0,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  available INTEGER NOT NULL DEFAULT 1,
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS pizzas (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  diameter_cm INTEGER NOT NULL,
  slices INTEGER NOT NULL,
  base_price REAL NOT NULL,
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS flavors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  extra_price REAL NOT NULL DEFAULT 0,
  description TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  available INTEGER NOT NULL DEFAULT 1,
  active INTEGER NOT NULL DEFAULT 1,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS edges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  pizza_id INTEGER NOT NULL,
  extra_price REAL NOT NULL,
  active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  fulfillment TEXT NOT NULL,
  street TEXT,
  number TEXT,
  reference TEXT,
  distance_m REAL DEFAULT 0,
  delivery_fee REAL NOT NULL DEFAULT 0,
  subtotal REAL NOT NULL,
  total REAL NOT NULL,
  payment_method TEXT NOT NULL,
  cash_amount REAL,
  change_amount REAL,
  notes TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'PENDING_PAYMENT',
  mp_payment_id TEXT,
  mp_preference_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  item_type TEXT NOT NULL,
  item_name TEXT NOT NULL,
  details TEXT DEFAULT '',
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL
);

INSERT OR IGNORE INTO settings(key,value) VALUES ('store_open','0');
INSERT OR IGNORE INTO settings(key,value) VALUES ('store_name','Pizza no Forninho');
INSERT OR IGNORE INTO settings(key,value) VALUES ('whatsapp','5575982333197');
INSERT OR IGNORE INTO settings(key,value) VALUES ('store_address','Rua B, Conjunto Lagoa Azul - Centro, Candeal - BA');
INSERT OR IGNORE INTO settings(key,value) VALUES ('slogan','Feita com carinho, assada para encantar.');
INSERT OR IGNORE INTO settings(key,value) VALUES ('delivery_0_300','2');
INSERT OR IGNORE INTO settings(key,value) VALUES ('delivery_301_700','3');
INSERT OR IGNORE INTO settings(key,value) VALUES ('delivery_701_1000','4');
INSERT OR IGNORE INTO settings(key,value) VALUES ('delivery_1001_plus','5');
INSERT OR IGNORE INTO settings(key,value) VALUES ('delivery_max_m','1700');
INSERT OR IGNORE INTO settings(key,value) VALUES ('delivery_time','30 a 45 minutos');

INSERT INTO pizzas(name,diameter_cm,slices,base_price,sort_order) SELECT 'Pequena',25,4,15,1 WHERE NOT EXISTS (SELECT 1 FROM pizzas WHERE name='Pequena');
INSERT INTO pizzas(name,diameter_cm,slices,base_price,sort_order) SELECT 'Média',30,6,30,2 WHERE NOT EXISTS (SELECT 1 FROM pizzas WHERE name='Média');
INSERT INTO pizzas(name,diameter_cm,slices,base_price,sort_order) SELECT 'Grande',35,8,40,3 WHERE NOT EXISTS (SELECT 1 FROM pizzas WHERE name='Grande');
INSERT INTO pizzas(name,diameter_cm,slices,base_price,sort_order) SELECT 'Família',40,10,50,4 WHERE NOT EXISTS (SELECT 1 FROM pizzas WHERE name='Família');

INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Calabresa','Tradicionais',0,1 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Calabresa');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Mussarela','Tradicionais',0,2 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Mussarela');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Frango','Tradicionais',0,3 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Frango');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Presunto','Tradicionais',0,4 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Presunto');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Milho','Tradicionais',0,5 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Milho');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Marguerita','Tradicionais',0,6 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Marguerita');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Calabresa com Milho','Tradicionais',0,7 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Calabresa com Milho');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Frango com Milho','Tradicionais',0,8 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Frango com Milho');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Calabresa com Catupiry','Tradicionais',0,9 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Calabresa com Catupiry');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Frango com Catupiry','Tradicionais',0,10 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Frango com Catupiry');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Milho com Catupiry','Tradicionais',0,11 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Milho com Catupiry');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Portuguesa','Especiais',3,12 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Portuguesa');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Quatro Queijos','Especiais',3,13 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Quatro Queijos');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Bacon','Especiais',3,14 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Bacon');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Frango com Catupiry Especial','Especiais',3,15 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Frango com Catupiry Especial');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Calabresa com Cheddar','Especiais',3,16 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Calabresa com Cheddar');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Lombinho','Especiais',3,17 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Lombinho');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Baiana','Especiais',3,18 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Baiana');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Atum','Especiais',3,19 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Atum');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Calabresa com Cream Cheese','Especiais',3,20 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Calabresa com Cream Cheese');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Frango com Cream Cheese','Especiais',3,21 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Frango com Cream Cheese');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Três Queijos','Especiais',3,22 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Três Queijos');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Carne Seca','Premium',5,23 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Carne Seca');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Filé Mignon','Premium',5,24 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Filé Mignon');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Camarão','Premium',5,25 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Camarão');
INSERT INTO flavors(name,category,extra_price,sort_order) SELECT 'Tomate Seco','Premium',5,26 WHERE NOT EXISTS (SELECT 1 FROM flavors WHERE name='Tomate Seco');

INSERT INTO products(name,category,price,sort_order) SELECT 'Refrigerante Lata (350ml)','Bebidas',5,1 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Refrigerante Lata (350ml)');
INSERT INTO products(name,category,price,sort_order) SELECT 'Refrigerante 1 Litro','Bebidas',10,2 WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Refrigerante 1 Litro');

INSERT INTO edges(name,pizza_id,extra_price) SELECT 'Catupiry',id,4 FROM pizzas WHERE name='Pequena' AND NOT EXISTS (SELECT 1 FROM edges e WHERE e.pizza_id=id AND e.name='Catupiry');
INSERT INTO edges(name,pizza_id,extra_price) SELECT 'Cheddar',id,5 FROM pizzas WHERE name='Pequena' AND NOT EXISTS (SELECT 1 FROM edges e WHERE e.pizza_id=id AND e.name='Cheddar');
INSERT INTO edges(name,pizza_id,extra_price) SELECT 'Catupiry',id,5 FROM pizzas WHERE name='Média' AND NOT EXISTS (SELECT 1 FROM edges e WHERE e.pizza_id=id AND e.name='Catupiry');
INSERT INTO edges(name,pizza_id,extra_price) SELECT 'Cheddar',id,6 FROM pizzas WHERE name='Média' AND NOT EXISTS (SELECT 1 FROM edges e WHERE e.pizza_id=id AND e.name='Cheddar');
INSERT INTO edges(name,pizza_id,extra_price) SELECT 'Catupiry',id,6 FROM pizzas WHERE name='Grande' AND NOT EXISTS (SELECT 1 FROM edges e WHERE e.pizza_id=id AND e.name='Catupiry');
INSERT INTO edges(name,pizza_id,extra_price) SELECT 'Cheddar',id,7 FROM pizzas WHERE name='Grande' AND NOT EXISTS (SELECT 1 FROM edges e WHERE e.pizza_id=id AND e.name='Cheddar');
INSERT INTO edges(name,pizza_id,extra_price) SELECT 'Catupiry',id,8 FROM pizzas WHERE name='Família' AND NOT EXISTS (SELECT 1 FROM edges e WHERE e.pizza_id=id AND e.name='Catupiry');
INSERT INTO edges(name,pizza_id,extra_price) SELECT 'Cheddar',id,9 FROM pizzas WHERE name='Família' AND NOT EXISTS (SELECT 1 FROM edges e WHERE e.pizza_id=id AND e.name='Cheddar');
