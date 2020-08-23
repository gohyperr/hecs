# Releases

Releases are made using lerna + scripts:

```
yarn release
```

- Prompts for new version
- Runs `yarn version` scripts in all packages (This currently updates peerDependencies to match the new version since lerna doesn't do this for us)
- Publishes all packages to NPM
- Commits and tags the commit with the new version