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
    "@semantic-release/commit-analyzer",
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
      },
    ],
  ],
};
