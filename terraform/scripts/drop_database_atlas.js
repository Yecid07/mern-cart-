// Script para eliminar la base de datos completamente en MongoDB Atlas
// Ejecutar con: mongosh "mongodb+srv://usuario:contraseña@cluster.mongodb.net/cart_production" < drop_database_atlas.js

db = db.getSiblingDB('cart_production');

print('⚠️  Eliminando base de datos: cart_production');
db.dropDatabase();

print('✓ Base de datos eliminada exitosamente de MongoDB Atlas');
