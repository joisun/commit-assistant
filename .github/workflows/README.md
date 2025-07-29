# GitHub Actions Workflows

This directory contains GitHub Actions workflows for the Commit Assistant VS Code extension.

## Workflows

### 1. Build and Test (`build.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches
- Manual dispatch

**What it does:**
- Tests the extension on Node.js 18.x and 20.x
- Compiles TypeScript code
- Builds the webview components
- Runs tests (if available)
- Packages the extension into a `.vsix` file
- Uploads build artifacts

### 2. Publish to Marketplace (`publish.yml`)

**Triggers:**
- Push tags starting with `v` (e.g., `v1.0.0`)
- Manual dispatch

**What it does:**
- Builds the extension
- Packages it into a `.vsix` file
- Publishes to VS Code Marketplace
- Creates GitHub release with the `.vsix` file attached
- Supports both regular and pre-release publishing

## Setup Instructions

### 1. VS Code Marketplace Token

You need to set up a `VSCE_TOKEN` secret in your GitHub repository:

1. Go to [Visual Studio Marketplace Publisher Management](https://marketplace.visualstudio.com/manage)
2. Sign in with your Microsoft account
3. Create a publisher account if you don't have one
4. Go to your publisher profile and create a Personal Access Token (PAT)
5. In your GitHub repository, go to Settings → Secrets and variables → Actions
6. Add a new repository secret named `VSCE_TOKEN` with your PAT as the value

### 2. OpenVSX Registry Token (for Cursor Marketplace)

To publish to Cursor Marketplace, you need an OpenVSX token:

1. Go to [OpenVSX Registry](https://open-vsx.org/)
2. Sign in with your GitHub account
3. Go to your user settings
4. Generate a new Access Token
5. In your GitHub repository, go to Settings → Secrets and variables → Actions
6. Add a new repository secret named `OVSX_TOKEN` with your OpenVSX token as the value

### 3. Update package.json

Make sure your `package.json` has the correct publisher name:

```json
{
  "publisher": "your-publisher-name"
}
```

### 4. Repository URL

Update the repository URL in `package.json`:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/commit-assistant"
  }
}
```

## Publishing Process

### Manual Release (Recommended)

1. Go to Actions tab in your GitHub repository
2. Select "Publish to VS Code Marketplace"
3. Click "Run workflow"
4. Fill in the required fields:
   - **Version**: Enter version number (e.g., `1.0.0`)
   - **Release type**: Choose `release` or `pre-release`
   - **Publish to OpenVSX**: Check if you want to publish to Cursor Marketplace
5. Click "Run workflow"

The workflow will:
- Update the version in `package.json`
- Build and package the extension
- Publish to VS Code Marketplace
- Optionally publish to OpenVSX Registry (Cursor Marketplace)
- Create GitHub release (for regular releases)

## Artifacts

Both workflows upload artifacts that you can download:

- **Build workflow**: Uploads `.vsix` files and build output
- **Publish workflow**: Uploads the published `.vsix` file

## Troubleshooting

### Common Issues

1. **Publisher not found**: Make sure the `publisher` field in `package.json` matches your VS Code Marketplace publisher name

2. **Token expired**: VS Code Marketplace tokens expire. Generate a new one and update the `VSCE_TOKEN` secret

3. **Build failures**: Check the build logs in the Actions tab. Common issues include:
   - Missing dependencies
   - TypeScript compilation errors
   - Webview build failures

### Debug Tips

- Check the Actions tab for detailed logs
- Ensure all dependencies are properly listed in `package.json`
- Test the build locally with `npm run build` before pushing



> publish to cursor: https://github.com/eclipse/openvsx/wiki/Publishing-Extensions
