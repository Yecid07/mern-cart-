# ⚡ CHEAT SHEET: Versionado con GitMoji

## 🎯 Lo Que Necesitas Saber En 1 minuto

### 1️⃣ El Único Formato Correcto
```bash
git commit -m "<emoji> <type>(<scope>): <descripción>"
```

**Ejemplos:**
```bash
✨ feat(user): agregar login social
🐛 fix(order): corregir cálculo de totales
📚 docs(readme): actualizar ejemplos
```

---

## 📊 Emojis Rápidos

| Cambio | Emoji | Comando | Versión |
|--------|-------|---------|---------|
| Nueva característica | ✨ | `✨ feat(scope): ...` | **MINOR** |
| Bug fix | 🐛 | `🐛 fix(scope): ...` | **PATCH** |
| Docs | 📚 | `📚 docs(scope): ...` | - |
| Refactoring | ♻️ | `♻️ refactor(scope): ...` | **PATCH** |
| Tests | ✅ | `✅ test(scope): ...` | **PATCH** |
| Seguridad | 🔒 | `🔒 security(scope): ...` | **PATCH** |
| Deps ↑ | ⬆️ | `⬆️ deps: ...` | **PATCH** |
| Estilos | 🎨 | `🎨 style(scope): ...` | **PATCH** |
| Breaking | 💥 | `💥 feat(scope): ...` | **MAJOR** |

🔗 **[Ver todos →](./GITMOJI_GUIDE.md)**

---

## 🚀 Flujo Básico

```bash
# 1. Hacer cambios
nano archivo.js

# 2. Commit con emoji OBLIGATORIO
git commit -m "✨ feat(product): agregar búsqueda"

# 3. Push a main
git push origin main

# ✅ Release automática en GitHub
```

---

## ⚠️ Lo Que NO Puedes Hacer

❌ `git commit -m "agregar búsqueda"`  
→ Falta emoji

❌ `git commit -m "✨ agregar búsqueda"`  
→ Falta tipo y scope

❌ `git commit -m "feat: agregar búsqueda"`  
→ Falta emoji

✅ `git commit -m "✨ feat(product): agregar búsqueda"`  
→ Perfecto

---

## 🎯 Mapeo Semver

```
✨ = MINOR version +1     (1.0.0 → 1.1.0)
🐛 = PATCH version +1     (1.0.0 → 1.0.1)
🔥💥 = MAJOR version +1   (1.0.0 → 2.0.0)
📚 = No cambia version
```

---

## 💡 Tips Rápidos

```bash
# Ver commits recientes
git log --oneline -5

# Ver tags/releases
git tag

# Script interactivo
./scripts/commit.sh

# Ver emojis en JSON
cat scripts/gitmoji-reference.json

# Preview de release
npm run release:dry

# Debug de release
npm run release:debug
```

---

## 📚 Documentación Rápida

| Necesito... | Ir a |
|------------|------|
| Empezar rápido | [README-QUICKSTART](./README-QUICKSTART.md) |
| Todos los emojis | [GITMOJI_GUIDE](./GITMOJI_GUIDE.md) |
| Configurar GitHub | [GITHUB_SETUP](./GITHUB_SETUP.md) |
| Qué hacer si falla | [CONTRIBUTING](./CONTRIBUTING.md) → Troubleshooting |
| Todo lo demás | [INDEX](./INDEX.md) |

---

## ❓ FAQ 10 segundos

**P: ¿Debo actualizar `package.json`?**  
R: NO. semantic-release lo hace.

**P: ¿Quién genera el CHANGELOG?**  
R: semantic-release automáticamente.

**P: ¿Qué pasa si me olvido el emoji?**  
R: El commit se rechaza. Intenta de nuevo con emoji.

**P: ¿Puedo cambiar un commit?**  
R: Sí: `git commit --amend -m "✨ feat: desc correcta"`

**P: ¿Lo que escriba importa?**  
R: Sí, pero primero OBLIGATORIO el emoji.

---

## 🔄 Referencia Visual

```
Usuario: git commit -m "✨ feat(x): desc"
                         ↓
                   Husky intercepta
                         ↓
                  Commitlint valida
                         ↓
         ✅ OK / ❌ Error - rechaza
                         ↓ (si OK)
               Commit aceptado
                         ↓
              git push origin main
                         ↓
             GitHub Actions ejecuta
                         ↓
          semantic-release al rescate
                         ↓
        Analiza commits + calcula versión
                         ↓
         Crea tag + CHANGELOG automático
                         ↓
         Publica Release en GitHub
```

---

## 🎬 Inicio Rápido 5 Min

```bash
# 1. Instalar (primera vez)
npm install

# 2. Hacer cambios
# ... edita archivos ...

# 3. Commit con emoji
git commit -m "✨ feat(product): búsqueda"

# 4. Push
git push origin main

# ✅ Done! Release automática en GitHub
```

---

## 🛠️ Comandos Principales

```bash
# Release preview
npm run release:dry

# Release real
npm run release

# Debug
npm run release:debug

# Verificar setup
chmod +x verify-versioning.sh && ./verify-versioning.sh

# Script interactivo
chmod +x scripts/commit.sh && ./scripts/commit.sh
```

---

## 📍 Scope (Ejemplos)

```
✨ feat(product): ...     # Para cambios en producto
✨ feat(order): ...       # Para cambios en órdenes
✨ feat(user): ...        # Para cambios en usuarios
✨ feat(api): ...         # Para cambios generales de API
✨ feat(auth): ...        # Para cambios en autenticación
```

---

## 🚫 Errores Comunes

```bash
# ❌ Error: "commitlint: ✨ not a valid type"
# → El segundo parámetro NO es el tipo
# → Formato: <emoji> <type>(<scope>): <msg>

# ❌ Commit rechazado en commit-msg
# → Falta el emoji o formato incorrecto

# ❌ "GITHUB_TOKEN not found"
# → Configurar permisos en GitHub Settings
```

---

## 📈 Cálculo de Versión

```
Commits en la semana:
- ✨ feat(x): ... → MINOR
- 🐛 fix(x): ... → PATCH
- 📚 docs(x): ... → NADA

Resultado: 1.0.0 → 1.1.0 (MINOR prevalece)
```

---

## 🎓 Próximo Paso

Leer: **[README-QUICKSTART.md](./README-QUICKSTART.md)** (5 min)  
Luego: Haz tu primer commit ✨

---

**Versión**: Quick Reference v2.0.0
