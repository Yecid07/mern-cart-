// Script para eliminar la base de datos completamente
// Ejecutar con: mongosh -u admin -p <password> --authenticationDatabase admin < drop_database.js

db = db.getSiblingDB('cart_production');

print('⚠️  Eliminando base de datos: cart_production');
db.dropDatabase();

print('✓ Base de datos eliminada exitosamente');
