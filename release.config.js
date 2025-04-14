module.exports = {
  branches: [
    "main",
    {
      name: "beta",
      prerelease: true, // auto suffixes like `-beta.1`
    },
    {
      name: "alpha",
      prerelease: true, // specific pre-release label
    },
    {
      name: "dev",
      prerelease: true, // specific pre-release label
    },
    {
      name: "rc",
      prerelease: true, // specific pre-release label
    },
  ],
  range: ">=1.4.3",
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        preset: "conventionalcommits",
        releaseRules: [
          { type: "refactor", release: "major" }, // 👈 always bump major on refactor
          { type: "feat", release: "minor" },
          { type: "fix", release: "patch" },
          { breaking: true, release: "major" }, // 👈 ensure BREAKING CHANGE triggers major
        ],
      },
    ],
    "@semantic-release/release-notes-generator",
    "@semantic-release/changelog",
    "@semantic-release/npm",
    "@semantic-release/github",
    [
      "@semantic-release/git",
      {
        assets: ["CHANGELOG.md", "package.json"],
        message:
          "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}",
        skipHooks: true, // ⛔️ skips husky hooks like commit-msg
      },
    ],
  ],
};
