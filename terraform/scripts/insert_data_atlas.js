// Script para insertar datos de prueba en MongoDB Atlas
// Ejecutar con: mongosh "mongodb+srv://usuario:contraseña@cluster.mongodb.net/cart_production" < insert_data_atlas.js

db = db.getSiblingDB('cart_production');

// Insertar usuarios
db.users.insertMany([
  {
    _id: "user1",
    name: "Juan Pérez",
    email: "juan@example.com",
    rol: "customer",
    createdAt: new Date()
  },
  {
    _id: "user2",
    name: "María García",
    email: "maria@example.com",
    rol: "customer",
    createdAt: new Date()
  }
]);

// Insertar productos
db.products.insertMany([
  {
    _id: "prod1",
    name: "Laptop",
    price: 999.99,
    stock: 10,
    category: "electronics",
    createdAt: new Date()
  },
  {
    _id: "prod2",
    name: "Mouse",
    price: 29.99,
    stock: 50,
    category: "accessories",
    createdAt: new Date()
  }
]);

// Insertar órdenes
db.orders.insertMany([
  {
    _id: "order1",
    userId: "user1",
    products: [
      { productId: "prod1", quantity: 1 }
    ],
    total: 999.99,
    status: "completed",
    createdAt: new Date()
  }
]);

// Mostrar datos
print('\n=== USUARIOS ===');
db.users.find().forEach(doc => printjson(doc));

print('\n=== PRODUCTOS ===');
db.products.find().forEach(doc => printjson(doc));

print('\n=== ÓRDENES ===');
db.orders.find().forEach(doc => printjson(doc));

print('\n✓ Datos insertados exitosamente en MongoDB Atlas');
