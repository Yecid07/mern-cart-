# Guía de Contribución

Gracias por contribuir a este proyecto. Por favor sigue estas instrucciones para mantener el código limpio y organizado.

## 📋 Prerequisitos

- Node.js 20+
- npm 10+
- Git
- Conocimiento de GitMoji (ver [GITMOJI_GUIDE.md](./GITMOJI_GUIDE.md))

## 🔧 Setup Local

```bash
# Clonar repositorio
git clone https://github.com/Yecid07/mern-cart-.git
cd mern-cart-

# Instalar dependencias (configura husky automáticamente)
npm install

# Verificar que todo funciona
npm test
```

## 🌿 Flujo de Ramas

```
main (production)
  ↑
develop (testing)
  ↑
feature/your-feature
```

**Pasos:**
1. Crear rama desde `develop`:
   ```bash
   git checkout develop
   git pull
   git checkout -b feature/nueva-caracteristica
   ```

2. Hacer cambios y commits con GitMoji:
   ```bash
   git commit -m "✨ feat(componente): descripción"
   ```

3. Hacer push:
   ```bash
   git push origin feature/nueva-caracteristica
   ```

4. Crear Pull Request a `develop`

## ✅ Validación de Commits

El proyecto incluye **commitlint** que valida automáticamente el formato.

### Formato Obligatorio
```
<emoji> <scope>(<component>): <descripción>
```

### Ejemplos Válidos ✅
```bash
✨ feat(product): agregar búsqueda por nombre
🐛 fix(order): corregir cálculo de impuestos
📚 docs(api): agregar ejemplos de uso
🔒 security(auth): validar permisos
```

### Ejemplos Inválidos ❌
```bash
feat: agregar búsqueda  # ❌ Falta emoji
✨ Product Search       # ❌ Formato incorrecto
✨ feat(product)        # ❌ Falta descripción
```

## 🧪 Testing

Antes de hacer push, asegúrate de pasar los tests:

```bash
# Ejecutar tests
npm test

# Con cobertura
npm run test:coverage

# Coverage gates
npm run quality:staging   # >= 60%
npm run quality:production # >= 99%
```

## 🎯 Proceso de Pull Request

1. **Titulo del PR**: Mismo formato que commits con emoji
   ```
   ✨ feat(product): agregar búsqueda por nombre
   ```

2. **Descripción**: 
   - Qué cambió
   - Por qué cambió
   - Cómo se prueba

3. **Checklist**:
   - [ ] Tests pasan locally (`npm test`)
   - [ ] Cobertura es adecuada
   - [ ] Commits usan GitMoji correcto
   - [ ] Documentación actualizada
   - [ ] No hay conflictos con `develop`

## 📝 Commits Cheat Sheet

| Cambio | Emoji | Ejemplo |
|--------|-------|---------|
| Nueva característica | ✨ | `✨ feat(user): agregar login social` |
| Bug fix | 🐛 | `🐛 fix(order): corregir total` |
| Documentación | 📚 | `📚 docs(readme): agregar ejemplos` |
| Seguridad | 🔒 | `🔒 security: validar tokens JWT` |
| Performance | ⚡ | `⚡ perf(api): optimizar consultas` |
| Tests | ✅ | `✅ test(product): agregar test de validación` |
| Refactoring | ♻️ | `♻️ refactor(service): simplificar lógica` |
| Dependencias ↑ | ⬆️ | `⬆️ deps: actualizar express` |
| Style/Format | 🎨 | `🎨 style: formatear código` |
| Deprecación | 🗑️ | `🗑️ chore: eliminar método antiguo` |
| Breaking change | 💥 | `💥 feat(api): cambiar estructura v1→v2` |
| Release | 🎉 | Generado automáticamente |

## 🚀 Versionado y Releases

El versionado es **AUTOMÁTICO** basado en commits:

- `🎉 📢 💥 🔥` → **MAJOR** (1.0.0 → 2.0.0)
- `✨ 🚀` → **MINOR** (1.0.0 → 1.1.0)
- `🐛 🔒 ⚡ ♻️` → **PATCH** (1.0.0 → 1.0.1)

No es necesario actualizar version ni CHANGELOG manualmente - se generan automáticamente en CI/CD.

## 💡 Buenas Prácticas

✅ **Hacer**
- Commits pequeños y enfocados
- Mensajes claros y descriptivos
- Una sola característica por commit
- Tests para todas las features
- Actualizar documentación

❌ **Evitar**
- Commits enormes con múltiples cambios
- Mensajes genéricos ("fix", "update")
- Mezclar tipos de cambios en un commit
- Omitir o falsear el emoji
- Pushear a `main` directamente

## 🆘 Problemas Comunes

### Commit rechazado: "Error validating commit message"

**Causa**: Formato incorrecto del mensaje.

**Solución**: Asegúrate que el formato sea:
```
<emoji> <scope>(<component>): <descripción>
```

### No puedo hacer commit después de instalar

**Causa**: Husky no está inicializado.

**Solución**:
```bash
npm run prepare
```

### ¿Cómo cambio un commit ya hecho?

```bash
# Modificar el último commit
git commit --amend -m "✨ feat(new): descripción correcta"
git push origin feature/rama --force-with-lease
```

## 📚 Referencias

- [GitMoji](https://gitmoji.dev/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Semantic Versioning](https://semver.org/)
- [Husky Docs](https://typicode.github.io/husky/)
- [Commitlint Docs](https://commitlint.js.org/)

---

¡Gracias por tu contribución! 🎉
