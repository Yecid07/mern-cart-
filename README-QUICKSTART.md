## ⚡ GUÍA DE INICIO RÁPIDO: Versionado v2.0.0

**Bienvenido al sistema de versionado automático con GitMoji.**

Este archivo te da lo esencial en 5 minutos. ⏱️

---

## 📚 Primero, Lee Esto

1. **[GITMOJI_GUIDE.md](./GITMOJI_GUIDE.md)** ← OBLIGATORIO (5 min)
   - Qué es GitMoji
   - Qué emoji usar para cada tipo de cambio
   - Ejemplos de commits

2. **[GITHUB_SETUP.md](./GITHUB_SETUP.md)** (5 min, una sola vez)
   - Cómo configurar GitHub para releases automáticas
   - Permisos necesarios
   - Crear rama `main`

---

## 🚀 Tu Primer Commit

### Paso 1: Haz cambios en código
```bash
# Edita lo que necesites
nano backend/routes/product.routes.js
```

### Paso 2: Verificar cambios
```bash
git status
git diff
```

### Paso 3: Stage de cambios
```bash
git add .
```

### Paso 4: Hacer commit **CON EMOJI**

```bash
# Opción A: Manual (más rápido)
git commit -m "✨ feat(product): agregar búsqueda por nombre"

# Opción B: Con script interactivo
chmod +x scripts/commit.sh
./scripts/commit.sh
```

⚠️ **IMPORTANTE**: El formato es OBLIGATORIO:
```
<emoji> <type>(<scope>): <descripción>
```

Ejemplos válidos ✅:
- `✨ feat(product): agregar búsqueda`
- `🐛 fix(order): corregir total`
- `📚 docs(readme): actualizar`

Ejemplos inválidos ❌:
- `feat: agregar búsqueda` (sin emoji)
- `✨ Product Search` (formato incorrecto)
- `Agregar búsqueda` (sin emoji ni formato)

### Paso 5: Si commitlint rechaza el commit

El sistema dirá qué está mal. Intenta de nuevo:

```bash
git commit -m "✨ feat(product): agregar búsqueda por nombre"
```

---

## 🎯 Mapeo Rápido: Emoji → Tipo de Cambio

| Cambio | Emoji | Comando |
|--------|-------|---------|
| **Nueva característica** | ✨ | `git commit -m "✨ feat(scope): ..."` |
| **Bug fix** | 🐛 | `git commit -m "🐛 fix(scope): ..."` |
| **Documentación** | 📚 | `git commit -m "📚 docs(scope): ..."` |
| **Refactoring** | ♻️ | `git commit -m "♻️ refactor(scope): ..."` |
| **Tests** | ✅ | `git commit -m "✅ test(scope): ..."` |
| **Seguridad** | 🔒 | `git commit -m "🔒 security(scope): ..."` |
| **Actualizar deps** | ⬆️ | `git commit -m "⬆️ deps: ..."` |
| **Estilos/formato** | 🎨 | `git commit -m "🎨 style(scope): ..."` |

**Ver [GITMOJI_GUIDE.md](./GITMOJI_GUIDE.md) para la lista completa.**

---

## 📤 Hacer Push (la mágía sucede aquí)

```bash
git push origin main
```

✨ **GitHub Actions detecta el push automáticamente:**
1. Ejecuta los tests
2. `semantic-release` analiza tus commits
3. Calcula la nueva versión automáticamente
4. Crea un git tag (ej: `v2.1.0`)
5. Genera CHANGELOG
6. Publica Release en GitHub

**Resultado**: Tu release está publicada automáticamente 🎉

---

## 📊 Cómo Se Calcula La Versión

```
Versión actual: 1.0.0

Tus commits:
✨ feat(product): agregar búsqueda      → MINOR +1
🐛 fix(order): corregir impuestos       → PATCH +1
📚 docs(readme): actualizar             → NO CHANGE

Nueva versión: 1.1.0  ← MINOR prevalece
```

**Regla simple:**
- 🎉🔥💥 = MAJOR (1.0.0 → 2.0.0)  **Breaking changes**
- ✨ = MINOR (1.0.0 → 1.1.0)  **Nuevas características**
- Otros emojis = PATCH (1.0.0 → 1.0.1)  **Arreglos/mejoras**

---

## 🔍 Ver Tus Releases

```bash
# Localmente
git tag      # Ver todos los tags

# En GitHub
# Ve a: github.com/tu-usuario/tu-repo/releases
```

---

## ❓ Preguntas Frecuentes

### P: Me rechazó el commit, ¿qué hago?

**R**: El formato es incorrecto. Debe ser:
```
<emoji> <type>(<scope>): <descripción>
```

```bash
# ❌ Incorrecto
git commit -m "agregar búsqueda"

# ✅ Correcto
git commit -m "✨ feat(product): agregar búsqueda"
```

### P: ¿Necesito actualizar `package.json` manualmente?

**R**: NO. semantic-release lo hace automáticamente.

### P: ¿Qué pasa si hago push sin el emoji?

**R**: El commit será rechazado **localmente** por `husky`/`commitlint`. No puede hacerse push sin emoji.

### P: ¿Puedo hacer release manualmente?

**R**: Sí, en tu máquina:
```bash
npm run release:dry    # Preview
npm run release        # Crear release
git push origin main --follow-tags
```

### P: ¿Dónde veo el historial de cambios?

**R**: En [CHANGELOG.md](./CHANGELOG.md) se actualiza automáticamente.

### P: ¿Qué es `npm run release:dry`?

**R**: Te muestra qué va a hacer el release SIN hacerlo realmente. Útil para probar.

---

## 🛠️ Si Algo Sale Mal

### Commitlint no funciona

```bash
npm run prepare
```

### Quiero probar antes de hacer push

```bash
npm run release:dry
```

### Ver logs detallados

```bash
npm run release:debug
```

### No puedo hacer push a `main`

Probablemente necesitas:
1. Crear la rama `main`: `git checkout -b main`
2. Hacer default branch en GitHub: Settings → Branches
3. Permisos en GitHub: Settings → Actions

Ver [GITHUB_SETUP.md](./GITHUB_SETUP.md) para detalles.

---

## 📋 Checklist Para Empezar

- [ ] Leí [GITMOJI_GUIDE.md](./GITMOJI_GUIDE.md)
- [ ] Leí [GITHUB_SETUP.md](./GITHUB_SETUP.md) ← IMPORTANTE
- [ ] Estoy en la rama `main` (o voy a hacer PR a ella)
- [ ] Hice el primer `git commit -m "✨ feat(...)"` con emoji
- [ ] El commit fue aceptado (sin errores de commitlint)
- [ ] Hice `git push origin main`
- [ ] Verifico en GitHub que el workflow ejecutó

---

## 📞 Documentación Completa

| Archivo | Para Quién | Contenido |
|---------|-----------|----------|
| [GITMOJI_GUIDE.md](./GITMOJI_GUIDE.md) | Todos | Guía completa de emojis |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | Contribuyentes | Cómo contribuir al proyecto |
| [GITHUB_SETUP.md](./GITHUB_SETUP.md) | DevOps/Admin | Configuración de GitHub |
| [VERSIONING_SUMMARY.md](./VERSIONING_SUMMARY.md) | Técnicos | Resumen completo del sistema |
| [SETUP_SUMMARY.md](./SETUP_SUMMARY.md) | Técnicos | Qué archivos fueron creados |
| [SYSTEM_DIAGRAM.md](./SYSTEM_DIAGRAM.md) | Visuales | Diagramas del flujo |

---

## 🎯 Resumen Ejecutivo

**Lo mínimo que necesitas saber:**

1. **Cada commit DEBE tener un emoji**
   ```bash
   ✨ feat(scope): descripción
   🐛 fix(scope): descripción
   📚 docs(scope): descripción
   ... etc
   ```

2. **Los emojis determinan la versión**
   - ✨ = versión MINOR
   - 🐛 y otros = versión PATCH
   - 🎉🔥💥 = versión MAJOR

3. **Las releases son automáticas**
   - Haz push a `main`
   - GitHub Actions crea la release automáticamente
   - CHANGELOG se actualiza automáticamente
   - Git tag se crea automáticamente

4. **Si necesitas ayuda**
   - Lectura rápida: Este archivo (5 min)
   - Guía completa: [GITMOJI_GUIDE.md](./GITMOJI_GUIDE.md) (15 min)
   - Setup de GitHub: [GITHUB_SETUP.md](./GITHUB_SETUP.md) (10 min)

---

## 🚀 TL;DR (Too Long; Didn't Read)

```bash
# 1. Hacer cambios
nano archivo.js

# 2. Commit con emoji (OBLIGATORIO)
git commit -m "✨ feat(scope): descripción"

# 3. Push a main
git push origin main

# ✅ Done! Release se crea automática

# 4. Ver release en GitHub
# github.com/tu-usuario/tu-repo/releases
```

---

**Versión**: 2.0.0 | **Última actualización**: 2026-04-01

¡Listo para versionar automáticamente! 🎉
