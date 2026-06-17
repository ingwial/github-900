// Simple Express server providing a products CRUD API and serving a SPA
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory products store
let products = [];
let nextId = 1;

// API routes
app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const p = products.find(x => x.id === id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  res.json(p);
});

app.post('/api/products', (req, res) => {
  const { name, price } = req.body;
  if (!name) return res.status(400).json({ error: 'Name required' });
  const prod = { id: nextId++, name, price: Number(price) || 0 };
  products.push(prod);
  res.status(201).json(prod);
});

app.put('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = products.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const { name, price } = req.body;
  products[idx] = { ...products[idx], name: name ?? products[idx].name, price: price !== undefined ? Number(price) : products[idx].price };
  res.json(products[idx]);
});

app.delete('/api/products/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = products.findIndex(x => x.id === id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  const removed = products.splice(idx, 1)[0];
  res.json(removed);
});

// Fallback to index for SPA routing
app.get('/spa/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'spa', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

