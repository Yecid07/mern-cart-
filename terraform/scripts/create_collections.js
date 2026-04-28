// Script para crear colecciones de MongoDB
// Ejecutar con: mongosh -u admin -p <password> --authenticationDatabase admin < create_collections.js

db = db.getSiblingDB('cart_production');

// Crear colecciones
db.createCollection('users');
db.createCollection('products');
db.createCollection('orders');
db.createCollection('messages');

// Crear índices
db.users.createIndex({ email: 1 }, { unique: true });
db.products.createIndex({ name: 1 });
db.orders.createIndex({ userId: 1 });
db.messages.createIndex({ createdAt: -1 });

print('Colecciones creadas exitosamente');
