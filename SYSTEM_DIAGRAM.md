# 🔄 Flujo de Versionado Automático

## Diagrama General del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                    DESARROLLADOR LOCAL                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Hacer cambios en código                                │
│  2. git add .                                              │
│  3. git commit -m "✨ feat(product): agregar búsqueda"    │
│                                                             │
│     ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ │
│                                                             │
│  ⚠️  Husky interceptor                                     │
│     └─→ .husky/commit-msg hook se ejecuta               │
│                                                             │
│  ⚠️  Commitlint valida                                     │
│     ├─ ¿Tiene emoji? ✓                                   │
│     ├─ ¿Formato correcto? ✓                              │
│     └─ ¿Mensaje válido? ✓                                │
│                                                             │
│  ✅ Commit aceptado                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           ↓ ↓ ↓
                    git push origin main
                           ↓ ↓ ↓
┌─────────────────────────────────────────────────────────────┐
│                     GITHUB REPOSITORY                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Detecta push en rama "main"                              │
│                                                             │
│  ↓ Ejecuta workflow: release.yml                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           ↓ ↓ ↓
┌─────────────────────────────────────────────────────────────┐
│              GITHUB ACTIONS: release.yml                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Checkout código                                        │
│  2. Setup Node.js 20                                       │
│  3. npm ci (instalar dependencias)                         │
│  4. npm run test (validar tests)                           │
│  5. npm run release (semantic-release)                     │
│                                                             │
│     ↓ semantic-release inicia                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           ↓ ↓ ↓
┌─────────────────────────────────────────────────────────────┐
│              SEMANTIC-RELEASE ANALYSIS                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. Lee commits desde último tag                           │
│                                                             │
│     Ejemplo de commits:                                    │
│     ✨ feat(product): agregar búsqueda    → MINOR          │
│     🐛 fix(order): corregir total         → PATCH          │
│     📚 docs(readme): actualizar           → NO CHANGE      │
│                                                             │
│  2. Calcula nueva versión                                  │
│                                                             │
│     Versión actual:   1.5.0                               │
│     Cambios:          1 MINOR + 1 PATCH                   │
│     Nueva versión:    1.6.0  (MINOR prevalece)            │
│                                                             │
│  3. Genera CHANGELOG                                       │
│                                                             │
│     ## [1.6.0] - 2026-04-01                               │
│                                                             │
│     ### ✨ Features                                        │
│     - feat(product): agregar búsqueda                     │
│                                                             │
│     ### 🐛 Fixes                                           │
│     - fix(order): corregir total                          │
│                                                             │
│  4. Actualiza package.json                                │
│                                                             │
│     "version": "1.6.0"                                     │
│                                                             │
│  5. Crea commits y tags                                    │
│                                                             │
│     git commit -m "🎉 chore(release): 1.6.0"             │
│     git tag v1.6.0                                         │
│                                                             │
│  6. Hace git push                                          │
│                                                             │
│     git push origin main                                   │
│     git push --tags                                        │
│                                                             │
│  7. Crea Release en GitHub                                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           ↓ ↓ ↓
┌─────────────────────────────────────────────────────────────┐
│                  GITHUB RELEASES                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🎉 Release v1.6.0 Published!                             │
│                                                             │
│  ├─ Title: v1.6.0                                         │
│  ├─ Tag: v1.6.0                                           │
│  ├─ Date: 2026-04-01                                      │
│  └─ Release Notes:                                         │
│     (Generado automáticamente del CHANGELOG)               │
│                                                             │
│     ## [1.6.0] - 2026-04-01                               │
│                                                             │
│     ### ✨ Features                                        │
│     - feat(product): agregar búsqueda                     │
│                                                             │
│     ### 🐛 Fixes                                           │
│     - fix(order): corregir total                          │
│                                                             │
│  Visible en: github.com/username/repo/releases            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
                           ↓ ↓ ↓
┌─────────────────────────────────────────────────────────────┐
│                   TODO COMPLETO ✅                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ Versión: 1.6.0                                         │
│  ✅ CHANGELOG.md actualizado                              │
│  ✅ package.json actualizado                              │
│  ✅ Git tag: v1.6.0 creado                                │
│  ✅ Release en GitHub publicada                           │
│  ✅ Ready for deployment!                                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Desglose de Decisiones SemVer

```
COMMIT TYPE              EMOJI    VERSION    EJEMPLO
─────────────────────────────────────────────────────────────
Breaking Change          🔥       MAJOR      1.0.0 → 2.0.0
Release Importante       🎉       MAJOR      1.0.0 → 2.0.0
Breaking Explicit        💥       MAJOR      1.0.0 → 2.0.0

Nueva Característica     ✨       MINOR      1.0.0 → 1.1.0

Bug Fix                  🐛       PATCH      1.0.0 → 1.0.1
Seguridad                🔒       PATCH      1.0.0 → 1.0.1
Refactoring              ♻️       PATCH      1.0.0 → 1.0.1
Estilos                  🎨       PATCH      1.0.0 → 1.0.1
Actualizar Deps          ⬆️       PATCH      1.0.0 → 1.0.1
Tests                    ✅       PATCH      1.0.0 → 1.0.1
Performance              🚀       PATCH      1.0.0 → 1.0.1
Otros                    ...      PATCH      1.0.0 → 1.0.1

Documentación            📚       ─ NO       (ya es 1.0.0)
Docs Solamente           📚       ─ NO       (ya es 1.0.0)
```

## Flujo de Commits a Release

```
Semana de desarrollo:
═══════════════════════════════════════════════════════════════

Lunes:   ✨ feat(product): agregar búsqueda
Martes:  🐛 fix(order): corregir impuestos
Martes:  📚 docs(readme): actualizar ejemplos
Miércoles:♻️ refactor(service): simplificar código
Jueves:  ✅ test(product): agregar validación
Viernes: 🔒 security(auth): validar permisos

Al hacer push a main:
═══════════════════════════════════════════════════════════════

semantic-release lee commits:
  - ✨ MINOR version +1
  - 🐛 PATCH version +1
  - 📚 NO CHANGE
  - ♻️ PATCH version +1
  - ✅ PATCH version +1
  - 🔒 PATCH version +1

Cálculo:
  Versión: 1.5.0
  MINOR: +1 (por ✨)
  PATCH: +4 (por 🐛♻️✅🔒)
  
  Nueva versión: 1.6.0  ← MINOR prevalece sobre PATCH

Release automática: v1.6.0 ✅
```

## Validación en Tiempo de Commit

```
Usuario intenta: git commit -m "Bug fix"
                            │
                            ↓
        ❌ Rechazado por husky/commitlint
        
Razones de rechazo:
  ✗ No tiene emoji
  ✗ Formato incorrecto
  ✗ No está en la lista de emojis permitidos
  ✗ Otro formato no válido

Usuario corrige: git commit -m "🐛 fix(order): corregir impuestos"
                            │
                            ↓
        husky/commit-msg hook ejecuta
        commitlint valida mensaje
                            │
                    ┌───────┴───────┐
                    │               │
            ✅ Válido      ❌ Inválido
                    │               │
              Commit OK    Rechazado + Error
```

## Estados de un Release

```
Estado 1: EN DESARROLLO
───────────────────────
  Rama: develop o feature/*
  Commits: Se hacen localmente
  Release: Ninguna

Estado 2: LISTO PARA RELEASE
─────────────────────────────
  Rama: main
  Commits: Esperando push
  Release: Se generará al hacer push

Estado 3: EN GENERACIÓN DE RELEASE
──────────────────────────────────
  Rama: main
  Status: GitHub Actions en progreso
  Workflow: release.yml ejecutando

Estado 4: RELEASE PUBLICADA
───────────────────────────
  Rama: main
  Versión: Actualizada
  Git Tag: Creado (v1.6.0)
  Release: Visible en GitHub
  CHANGELOG: Actualizado
  Status: ✅ Completado
```

## Estructura de Directorios Relevantes

```
mern-cart-/
│
├── .github/
│   ├── workflows/
│   │   ├── ci-testing.yml
│   │   ├── ci-production.yml
│   │   └── release.yml          ← VERSIONADO
│   │
│   └── GITHUB_SETUP.md           ← INSTRUCCIONES
│
├── .husky/
│   └── commit-msg                ← GIT HOOK
│
├── scripts/
│   ├── commit.sh                 ← HELPER SCRIPT
│   └── gitmoji-reference.json    ← REFERENCIA
│
├── .commitlintrc.json            ← CONFIG COMMITLINT
├── release.config.js             ← CONFIG RELEASE
├── CHANGELOG.md                  ← HISTORIAL
├── GITMOJI_GUIDE.md             ← DOCUMENTACIÓN
├── CONTRIBUTING.md              ← DOCUMENTACIÓN
├── VERSIONING_SUMMARY.md        ← DOCUMENTACIÓN
├── SETUP_SUMMARY.md             ← DOCUMENTACIÓN
│
└── package.json                  ← SCRIPTS + VERSIÓN
    ├── "release": "semantic-release"
    ├── "release:dry": "semantic-release --dry-run"
    └── "prepare": "husky install"
```

---

**Generado**: 2026-04-01 | **Sistema**: Versionado Automático v2.0.0
