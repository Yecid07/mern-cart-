#!/bin/bash
# Script de verificación: Sistema de Versionado
# Este script verifica que todo esté correctamente configurado

echo "🔍 Verificando Sistema de Versionado..."
echo ""

# Verificar commitlint
echo -n "✓ Commitlint: "
npx commitlint --version 2>/dev/null || echo "❌ No encontrado"

# Verificar semantic-release
echo -n "✓ Semantic-release: "
npx semantic-release --version 2>/dev/null || echo "❌ No encontrado"

# Verificar husky
echo -n "✓ Husky: "
npx husky --version 2>/dev/null || echo "❌ No encontrado"

# Verificar archivos de configuración
echo ""
echo "📁 Archivos de Configuración:"
[ -f ".commitlintrc.json" ] && echo "  ✓ .commitlintrc.json" || echo "  ❌ .commitlintrc.json falta"
[ -f "release.config.js" ] && echo "  ✓ release.config.js" || echo "  ❌ release.config.js falta"
[ -f ".husky/commit-msg" ] && echo "  ✓ .husky/commit-msg" || echo "  ❌ .husky/commit-msg falta"

# Verificar documentación
echo ""
echo "📚 Documentación:"
[ -f "GITMOJI_GUIDE.md" ] && echo "  ✓ GITMOJI_GUIDE.md" || echo "  ❌ GITMOJI_GUIDE.md falta"
[ -f "CONTRIBUTING.md" ] && echo "  ✓ CONTRIBUTING.md" || echo "  ❌ CONTRIBUTING.md falta"
[ -f "GITHUB_SETUP.md" ] && echo "  ✓ GITHUB_SETUP.md" || echo "  ❌ GITHUB_SETUP.md falta"
[ -f "CHANGELOG.md" ] && echo "  ✓ CHANGELOG.md" || echo "  ❌ CHANGELOG.md falta"
[ -f "VERSIONING_SUMMARY.md" ] && echo "  ✓ VERSIONING_SUMMARY.md" || echo "  ❌ VERSIONING_SUMMARY.md falta"

# Verificar que package.json tiene scripts
echo ""
echo "📦 Scripts en package.json:"
grep -q '"release"' package.json && echo "  ✓ release" || echo "  ❌ release falta"
grep -q '"release:dry"' package.json && echo "  ✓ release:dry" || echo "  ❌ release:dry falta"
grep -q '"release:debug"' package.json && echo "  ✓ release:debug" || echo "  ❌ release:debug falta"
grep -q '"prepare"' package.json && echo "  ✓ prepare" || echo "  ❌ prepare falta"

# Verificar workflow
echo ""
echo "⚙️ GitHub Actions:"
[ -f ".github/workflows/release.yml" ] && echo "  ✓ release.yml" || echo "  ❌ release.yml falta"

echo ""
echo "✅ Verificación completada!"
echo ""
echo "📖 Para empezar:"
echo "   1. Lee: GITMOJI_GUIDE.md"
echo "   2. Lee: GITHUB_SETUP.md"
echo "   3. Haz tu primer commit: git commit -m \"✨ feat(api-v2): inicializar\""
echo "   4. Push a main: git push origin main"
echo ""
