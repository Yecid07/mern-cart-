# Guía GitMoji para Commits

Este proyecto usa **GitMoji** para estandarizar los commits y facilitar el versionado semántico automático.

## 📋 GitMojis Permitidos

| Emoji | Código | Tipo | Versión |
|-------|--------|------|---------|
| 🎉 | `:tada:` | Release importante / Inicial | **MAJOR** |
| ✨ | `:sparkles:` | Nueva característica | **MINOR** |
| 🐛 | `:bug:` | Corrección de bugs | **PATCH** |
| 🔥 | `:fire:` | Eliminar código/característica | **MAJOR** |
| 📚 | `:books:` | Documentación | (sin cambio) |
| 🔒 | `:lock:` | Seguridad | **PATCH** |
| ⬆️ | `:arrow_up:` | Actualizar dependencias | **PATCH** |
| ⬇️ | `:arrow_down:` | Downgrade de dependencias | **PATCH** |
| 🎨 | `:art:` | Estilos/formato | **PATCH** |
| ♻️ | `:recycle:` | Refactoring | **PATCH** |
| 📦 | `:package:` | Compilación/packaging | **PATCH** |
| 🚀 | `:rocket:` | Deployment | **PATCH** |
| ✅ | `:white_check_mark:` | Tests | **PATCH** |
| 🔗 | `:link:` | Cambios de correlación | **PATCH** |
| 💥 | `:boom:` | Breaking change | **MAJOR** |
| 🗑️ | `:wastebasket:` | Deprecar | **PATCH** |

## 🖊️ Formato de Commit

```
<emoji> <scope>(<component>): <descripción corta>

<descripción detallada opcional>

<footer>
```

## 📝 Ejemplos

```bash
# Nueva característica para API de productos
✨ feat(product-api): agregar validación de stock

# Bug en el controlador de órdenes
🐛 fix(order-controller): corregir cálculo de totales

# Documentación del API
📚 docs(readme): actualizar instrucciones de instalación

# Seguridad
🔒 security(auth): validar tokens en rutas protegidas

# Refactoring
♻️ refactor(user-service): simplificar lógica de autenticación

# Breaking change
💥 feat(api): cambiar estructura de respuesta de v1 a v2

# Actualizar dependencias
⬆️ deps: actualizar express a v4.21.0
```

## ⚙️ Instalación Local

El proyecto incluye **commitlint** + **husky** para validar automáticamente los commits.

Al hacer commit, se ejecutará:
```bash
git commit -m "✨ feat(products): agregar nueva característica"
```

Si el formato es incorrecto, el commit será rechazado con un mensaje de error.

## 🔄 Versionado Automático

El versionado semántico se calcula automáticamente según los commits:

- **MAJOR** (ej: 1.0.0 → 2.0.0): `🔥`, `💥`, `🎉` 
- **MINOR** (ej: 1.0.0 → 1.1.0): `✨`
- **PATCH** (ej: 1.0.0 → 1.0.1): `🐛`, `🔒`, `♻️`, etc.

## 📤 Crear Release

El proceso es automático con CI/CD, pero para hacerlo manual:

```bash
npm run release
```

Esto:
1. Analiza commits desde el último tag
2. Determina la nueva versión
3. Genera CHANGELOG.md
4. Actualiza package.json
5. Crea un tag en Git
6. Hace push a GitHub (con CI/CD crea la Release)

## 🎯 Buenas Prácticas

- ✅ Hacer commits pequeños y enfocados
- ✅ Usar el emoji correcto según el tipo de cambio
- ✅ Descripción concisa en presente ("agregar" no "agregó")
- ✅ Un único emoji por commit
- ❌ No mezclar tipos de cambios diferentes en un commit
- ❌ No omitir el emoji

## 📚 Referencias

- [GitMoji Official](https://gitmoji.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Sem Ver](https://semver.org/)
