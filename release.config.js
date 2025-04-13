module.exports = {
  branches: [
    "main",
    { name: "beta", prerelease: true, start: "2.0.1" },
    { name: "alpha", prerelease: true, start: "2.0.1" },
    { name: "dev", prerelease: true, start: "2.0.1" },
    { name: "rc", prerelease: true, start: "2.0.1" },
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
