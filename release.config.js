/**
 * Configuración de semantic-release para versionado automático
 * Con soporte para GitMoji en los commits
 */
export default {
  branches: [
    "main",
    {
      name: "develop",
      prerelease: "alpha",
      channel: "alpha"
    }
  ],
  repositoryUrl: "https://github.com/Yecid07/mern-cart-", // Cambia según tu repo
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "angular",
        releaseRules: [
          // GitMoji mapping a SemVer
          { type: "✨", release: "minor" }, // feat/nueva característica
          { type: "🐛", release: "patch" }, // bugfix
          { type: "🔥", release: "major" }, // eliminación de features (breaking)
          { type: "🎉", release: "major" }, // release importante
          { type: "📚", release: false }, // documentación
          { type: "🎨", release: "patch" }, // estilos/refactoring
          { type: "♻️", release: "patch" }, // refactoring
          { type: "⬆️", release: "patch" }, // dependencias actualización
          { type: "🚀", release: "patch" }, // deployment
          { type: "✅", release: "patch" }, // tests
          { type: "🔒", release: "patch" } // seguridad
        ]
      }
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        preset: "angular"
      }
    ],
    [
      "@semantic-release/changelog",
      {
        changelogFile: "CHANGELOG.md"
      }
    ],
    [
      "@semantic-release/git",
      {
        assets: ["package.json", "package-lock.json", "CHANGELOG.md"],
        message: "🎉 chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    [
      "@semantic-release/github",
      {
        successComment: false,
        failComment: false,
        labels: false,
        releasedLabels: false
      }
    ]
  ]
};
