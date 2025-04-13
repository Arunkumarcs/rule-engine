module.exports = {
  branches: [
    "main",
    { name: "beta", prerelease: true },
    { name: "alpha", prerelease: true },
    { name: "dev", prerelease: true },
    { name: "rc", prerelease: true },
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
        skipHooks: true, // ⛔️ skips husky hooks like commit-msg
      },
    ],
  ],
};
