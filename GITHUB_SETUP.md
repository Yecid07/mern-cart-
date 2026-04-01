# Configuración de GitHub para Releases Automáticas

Esta guía te ayudará a configurar GitHub y semantic-release para generar releases automáticamente.

## 1. Verificar Permisos del Repositorio

1. Ve a **Settings** → **Actions**
2. En "Workflow permissions" selecciona:
   - ✅ **Read and write permissions**
   - ✅ **Allow GitHub Actions to create and approve pull requests**
3. Click en **Save**

## 2. Configurar GITHUB_TOKEN

`GITHUB_TOKEN` es un token special que GitHub proporciona automáticamente en workflows.

NO necesitas configurarlo manualmente - está disponible automáticamente en todos los workflows.

### Verificar que esté habilitado:

1. **Settings** → **Actions** → **General**
2. En "Workflow permissions", asegúrate que tenga permisos de:
   - Lectura y escritura (`Read and write permissions`)
   - Crear PRs y commits

## 3. Crear Rama `main`

`semantic-release` requiere la rama `main` como rama principal.

```bash
# Si aún no existe main, crear desde production o develop
git checkout production  # o develop
git checkout -b main
git push -u origin main
```

Luego en GitHub:
1. **Settings** → **Branches**
2. Cambia "Default branch" a **main**

## 4. Configurar Reglas de Protección (Opcional pero Recomendado)

Para mayor control sobre las releases:

1. **Settings** → **Branches** → **Branch protection rules**
2. Click en **Add rule** para **main**
3. Configurar:
   - ✅ Require pull request reviews before merging (al menos 1)
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require branches to be up to date before merging
   - ✅ Require status checks to pass before merging
     - Selecciona los workflows: `CI Production`, `Release`

## 5. Habilitar Workflows

1. **Actions** (pestaña en el repositorio)
2. Click en **I understand my workflows, go ahead and enable them**

## 6. Crear Primera Release Manual (Opcional)

Si quieres crear la primera release manualmente antes de automatizar:

```bash
# En tu máquina local, en la rama main
git checkout main
npm run release:dry  # Preview
npm run release      # Crear release real
```

Luego haz push:
```bash
git push origin main --follow-tags
```

## 7. Configurar Distintas Ramas de Release (Opcional)

Si quieres usar diferentes ramas para prerelease, puedes modificar `release.config.js`:

```javascript
branches: [
  "main",                    // releases estables
  {
    name: "develop",
    prerelease: "alpha",     // v1.0.0-alpha.1
    channel: "alpha"
  },
  {
    name: "staging",
    prerelease: "beta",      // v1.0.0-beta.1
    channel: "beta"
  }
]
```

## 8. Ver Releases Creadas

1. Ve a tu repositorio
2. **Releases** (lado derecho)
3. Cada release muestra:
   - Versión (ej: v2.1.0)
   - Changelog automático
   - Assets (archivos descargables)
   - Autor y fecha

## 9. Troubleshooting

### ❌ Release no se crea

**Causas comunes:**
- Rama es `master` o `develop`, no `main`
- Los commits no tienen GitMoji
- Los tests fallan
- Falta el GITHUB_TOKEN

**Solución:**
```bash
# Ver logs del workflow
1. Ve a Actions
2. Click en el workflow "Release" más reciente
3. Click en el job "release"
4. Observa los mensajes de error
```

### ❌ Error: "Invalid branch"

**Causa**: semantic-release espera la rama `main`.

**Solución**: Asegurate que exista la rama `main` y que sea el default branch.

### ❌ "GITHUB_TOKEN not found"

Aunque sea raro, puedes verificar que esté disponible:

1. En el workflow `release.yml`, añade:
   ```yaml
   - name: Check token
     run: |
       if [ -z "${{ secrets.GITHUB_TOKEN }}" ]; then
         echo "Error: GITHUB_TOKEN not available"
         exit 1
       fi
   ```

2. Ejecuta el workflow manualmente
3. Verifica en los logs

## 10. Flujo Completo: De Commit a Release

```
Commit con GitMoji en develop
  ↓
Pull Request a main
  ↓
Merge a main (o push directo)
  ↓
GitHub Actions ejecuta release.yml
  ↓
semantic-release analiza commits
  ↓
Calcula nueva versión (MAJOR.MINOR.PATCH)
  ↓
Crea commit con nueva versión en package.json
  ↓
Crea tag (ej: v2.1.0)
  ↓
Actualiza CHANGELOG.md
  ↓
Hace push de cambios y tag
  ↓
GitHub crea Release automáticamente
  ↓
GitHub Actions ejecuta workflow "Release"
```

## 11. Comandos Útiles

```bash
# Hacer release localmente (para testing)
npm run release:dry

# Hacer release actual con debug
DEBUG=semantic-release npm run release

# Ver todas las releases
git tag

# Borrar tag local (cuidado!)
git tag -d v2.1.0

# Borrar tag remoto (cuidado!)
git push origin --delete v2.1.0
```

## 12. Variables de Entorno (Avanzado)

Si necesitas más control, puedes crear un `.releaserc.js`:

```javascript
module.exports = {
  branches: ["main"],
  repositoryUrl: "https://github.com/tu-usuario/tu-repo",
  plugins: [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/git",
    "@semantic-release/github"
  ]
};
```

## 📚 Referencias Útiles

- [Semantic Release Docs](https://semantic-release.gitbook.io/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitMoji Conventions](https://gitmoji.dev/)

---

¡Listo! Ahora tu repositorio está configurado para releases automáticas. 🚀

Cada push a `main` con commits válidos (con GitMoji) generará automáticamente:
- Nueva versión
- CHANGELOG actualizado
- Release en GitHub con todos los cambios
