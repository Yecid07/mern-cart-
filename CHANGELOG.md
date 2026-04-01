# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.0.0](https://github.com/Yecid07/mern-cart-/releases/tag/2.0.0) (2026-04-01)

### ✨ Features

- **API**: Migración de API v1 a v2 con arquitectura multicloud
- **Backend**: Soporte para API v2 con nuevas rutas
- **Versionado**: Sistema de versionado semántico con GitMoji configurado

### 🔄 Breaking Changes

- API endpoints ahora usan ruta `/api/v2/` en lugar de `/api/`
- Estructura de respuestas actualizada para mayor compatibilidad

## [1.0.0](https://github.com/Yecid07/mern-cart-/releases/tag/1.0.0) (2026-03-01)

### ✨ Features

- **Initial Release**: Primera versión funcional de Cart Course API
- **CI/CD**: Pipelines de testing y production en Docker
- **Testing**: Cobertura de tests con vitest y coverage reports
- **API**: Endpoints para productos, usuarios y órdenes
- **Frontend**: Interfaz básica con React y Chakra UI

---

### 📝 Notas de Versioning

Este proyecto sigue [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH):

- **MAJOR**: Cambios incompatibles (breaking changes)
- **MINOR**: Nuevas características compatibles hacia atrás
- **PATCH**: Correcciones de bugs compatibles hacia atrás

Los commits deben usar [GitMoji](https://gitmoji.dev/) para facilitar el versionado automático.

Ver [GITMOJI_GUIDE.md](./GITMOJI_GUIDE.md) para instrucciones completas.
