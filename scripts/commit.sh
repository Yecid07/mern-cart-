#!/bin/bash
# Script interactivo para crear commits con GitMoji
# Uso: chmod +x scripts/commit.sh && ./scripts/commit.sh

echo "🎉 Generador de Commits con GitMoji"
echo "===================================="
echo ""

# Seleccionar emoji
echo "Selecciona el tipo de cambio:"
echo ""
echo "🎉 (1) Release importante"
echo "✨ (2) Nueva característica"
echo "🐛 (3) Corrección de bug"
echo "🔥 (4) Eliminar código"
echo "📚 (5) Documentación"
echo "🔒 (6) Seguridad"
echo "⬆️  (7) Actualizar dependencias"
echo "🎨 (8) Estilos/formato"
echo "♻️  (9) Refactoring"
echo "✅ (10) Tests"
echo "💥 (11) Breaking change"
echo ""

read -p "Opción (1-11): " choice

case $choice in
  1) EMOJI="🎉" TYPE="chore(release)" ;;
  2) EMOJI="✨" TYPE="feat" ;;
  3) EMOJI="🐛" TYPE="fix" ;;
  4) EMOJI="🔥" TYPE="feat! (breaking)" ;;
  5) EMOJI="📚" TYPE="docs" ;;
  6) EMOJI="🔒" TYPE="security" ;;
  7) EMOJI="⬆️" TYPE="chore(deps)" ;;
  8) EMOJI="🎨" TYPE="style" ;;
  9) EMOJI="♻️" TYPE="refactor" ;;
  10) EMOJI="✅" TYPE="test" ;;
  11) EMOJI="💥" TYPE="feat! (breaking)" ;;
  *) echo "Opción inválida"; exit 1 ;;
esac

echo ""
echo "Tipo seleccionado: $TYPE"
echo ""

read -p "Componente/Scope (ej: product, order, user): " scope
read -p "Descripción corta (ej: agregar validación): " description

# Crear mensaje
MESSAGE="$EMOJI $TYPE($scope): $description"

echo ""
echo "Mensaje: $MESSAGE"
echo ""
read -p "¿Confirmar? (s/n): " confirm

if [ "$confirm" = "s" ]; then
  git commit -m "$MESSAGE"
else
  echo "Commit cancelado"
fi
