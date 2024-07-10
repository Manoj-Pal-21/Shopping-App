const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { getStoredItems, storeItems } = require('./data/items');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.json());

// CORS headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Serve static files from the frontend build directory
const frontendPath = path.join(__dirname, '../FRONTEND/dist');
app.use(express.static(frontendPath));

// API endpoints
app.get('/items', async (req, res) => {
  const storedItems = await getStoredItems();
  await new Promise((resolve, reject) => setTimeout(() => resolve(), 1000));
  res.json({ items: storedItems });
});

app.get('/items/:id', async (req, res) => {
  const storedItems = await getStoredItems();
  const item = storedItems.find((item) => item.id === req.params.id);
  res.json({ item });
});

app.post('/items', async (req, res) => {
  const existingItems = await getStoredItems();
  const itemData = req.body;
  const newItem = {
    ...itemData,
    id: Math.random().toString(),
  };
  const updatedItems = [newItem, ...existingItems];
  await storeItems(updatedItems);
  res.status(201).json({ message: 'Stored new item.', item: newItem });
});

// Serve index.html for all other routes (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});




// const express = require('express');
// const bodyParser = require('body-parser');

// const { getStoredItems, storeItems } = require('./data/items');

// const app = express();

// app.use(bodyParser.json());

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });

// app.get('/items', async (req, res) => {
//   const storedItems = await getStoredItems();
//   await new Promise((resolve, reject) => setTimeout(() => resolve(), 1000));
//   res.json({ items: storedItems });
// });

// app.get('/items/:id', async (req, res) => {
//   const storedItems = await getStoredItems();
//   const item = storedItems.find((item) => item.id === req.params.id);
//   res.json({ item });
// });

// app.post('/items', async (req, res) => {
//   const existingItems = await getStoredItems();
//   const itemData = req.body;
//   const newItem = {
//     ...itemData,
//     id: Math.random().toString(),
//   };
//   const updatedItems = [newItem, ...existingItems];
//   await storeItems(updatedItems);
//   res.status(201).json({ message: 'Stored new item.', item: newItem });
// });

// app.listen(8080);