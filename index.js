const fs = require('fs');

// Get the paths to the federated app and host app webpack configuration files.
const FEDERATED_APP_CONFIG = process.env.FEDERATED_APP_CONFIG;
const HOST_APP_CONFIG = process.env.HOST_APP_CONFIG;

// Validate the federated app configuration
console.log('Validating federated app configuration...');
const federatedAppConfig = require(FEDERATED_APP_CONFIG);
if (!federatedAppConfig.exposes) {
  console.error('Error: Federated app configuration does not expose any modules.');
  process.exit(1);
}
if (!federatedAppConfig.shared) {
  console.error('Error: Federated app configuration does not specify any shared modules.');
  process.exit(1);
}

// Validate the host app configuration
console.log('Validating host app configuration...');
const hostAppConfig = require(HOST_APP_CONFIG);
if (!hostAppConfig.remotes) {
  console.error('Error: Host app configuration does not include any remotes.');
  process.exit(1);
}
if (!hostAppConfig.shared) {
  console.error('Error: Host app configuration does not specify any shared modules.');
  process.exit(1);
}

// Get the name of the federated app
const federatedAppName = federatedAppConfig.name;

// Validate the remotes in the host app configuration
console.log('Validating remotes in host app configuration...');
const remoteNames = Object.keys(hostAppConfig.remotes);
remoteNames.forEach(remoteName => {
  const remoteUrl = hostAppConfig.remotes[remoteName];
  if (!remoteUrl) {
    console.error(`Error: Remote ${remoteName} is missing a URL in host app configuration.`);
    process.exit(1);
  }
  if (!federatedAppConfig.exposes[remoteName]) {
    console.error(`Error: Remote ${remoteName} is not exposed by the federated app.`);
    process.exit(1);
  }
});

// Validate the shared modules in the host app configuration
console.log('Validating shared modules in host app configuration...');
const sharedModules = Object.keys(hostAppConfig.shared);
sharedModules.forEach(sharedModule => {
  if (!federatedAppConfig.shared[sharedModule]) {
    console.error(`Error: Shared module ${sharedModule} is not specified by the federated app.`);
    process.exit(1);
  }
});

console.log('Webpack5 module federation is valid for the federated app and host app configurations!');
