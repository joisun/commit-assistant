#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 Pre-publish validation check...\n');

// Read package.json
const packageJsonPath = path.join(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

let hasErrors = false;

// Check required fields
const requiredFields = [
  'name',
  'displayName', 
  'description',
  'version',
  'publisher',
  'engines.vscode',
  'main'
];

console.log('📋 Checking required fields...');
requiredFields.forEach(field => {
  const value = field.includes('.') 
    ? field.split('.').reduce((obj, key) => obj?.[key], packageJson)
    : packageJson[field];
    
  if (!value) {
    console.log(`❌ Missing required field: ${field}`);
    hasErrors = true;
  } else {
    console.log(`✅ ${field}: ${value}`);
  }
});

// Check repository URL
console.log('\n🔗 Checking repository URL...');
if (packageJson.repository?.url?.includes('your-username')) {
  console.log('❌ Repository URL contains placeholder "your-username"');
  console.log('   Please update the repository URL in package.json');
  hasErrors = true;
} else if (packageJson.repository?.url) {
  console.log(`✅ Repository URL: ${packageJson.repository.url}`);
} else {
  console.log('⚠️  No repository URL specified');
}

// Check icon file
console.log('\n🖼️  Checking icon file...');
if (packageJson.icon) {
  const iconPath = path.join(__dirname, '..', packageJson.icon);
  if (fs.existsSync(iconPath)) {
    console.log(`✅ Icon file exists: ${packageJson.icon}`);
  } else {
    console.log(`❌ Icon file not found: ${packageJson.icon}`);
    hasErrors = true;
  }
} else {
  console.log('⚠️  No icon specified');
}

// Check main file
console.log('\n📦 Checking main file...');
if (packageJson.main) {
  const mainPath = path.join(__dirname, '..', packageJson.main);
  if (fs.existsSync(mainPath)) {
    console.log(`✅ Main file exists: ${packageJson.main}`);
  } else {
    console.log(`❌ Main file not found: ${packageJson.main}`);
    console.log('   Run "npm run build" to compile the extension');
    hasErrors = true;
  }
}

// Check build output
console.log('\n🏗️  Checking build output...');
const outDir = path.join(__dirname, '..', 'out');
if (fs.existsSync(outDir)) {
  const files = fs.readdirSync(outDir);
  if (files.length > 0) {
    console.log(`✅ Build output directory contains ${files.length} files`);
  } else {
    console.log('❌ Build output directory is empty');
    hasErrors = true;
  }
} else {
  console.log('❌ Build output directory not found');
  hasErrors = true;
}

// Check webview build
console.log('\n🌐 Checking webview build...');
const webviewDir = path.join(__dirname, '..', 'out', 'webview');
if (fs.existsSync(webviewDir)) {
  const webviewFiles = fs.readdirSync(webviewDir);
  const hasJs = webviewFiles.some(f => f.endsWith('.js'));
  const hasCss = webviewFiles.some(f => f.endsWith('.css'));
  
  if (hasJs && hasCss) {
    console.log('✅ Webview build files found (JS and CSS)');
  } else {
    console.log('❌ Webview build incomplete');
    console.log(`   Found: ${webviewFiles.join(', ')}`);
    hasErrors = true;
  }
} else {
  console.log('❌ Webview build directory not found');
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Pre-publish check FAILED');
  console.log('   Please fix the issues above before publishing');
  process.exit(1);
} else {
  console.log('✅ Pre-publish check PASSED');
  console.log('   Extension is ready for publishing!');
}
