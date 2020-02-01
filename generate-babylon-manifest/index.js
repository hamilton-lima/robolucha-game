const fs = require("fs");
const path = require('path');

const extension = ".babylon";
const manifestExtension = ".manifest"
// creates a new manifest with the current timestamp
const manifest = {
  version: Number(Date.now()),
  enableSceneOffline: false,
  enableTexturesOffline: false
};

if (process.argv.length <= 2) {
  console.log("Usage: " + __filename + " path/to/directory");
  process.exit(-1);
}

var pathName = process.argv[2];

fs.readdir(pathName, function(err, items) {
  for (var i = 0; i < items.length; i++) {
    const file = items[i];
    if (file.endsWith(extension)) {
        const manifestName = path.join(pathName, file + manifestExtension)
        console.log("writing manifest", manifestName);

        fs.writeFileSync(manifestName, JSON.stringify(manifest));
    }
  }
});
