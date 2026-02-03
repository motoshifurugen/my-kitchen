// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Ensure webp files are treated as assets
config.resolver.assetExts = [...config.resolver.assetExts, 'webp'];

module.exports = config;
