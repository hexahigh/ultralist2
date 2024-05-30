const fs = require("fs");
const axios = require("axios");
const path = require("path");

// Read URLs from a JSON file
const urls = require("./urls.json");
const directoryPath = path.join(__dirname, 'temp');
const outputPath = path.join(__dirname, 'lists/ultralist-UB.txt');

async function downloadFile(fileUrl, outputLocationPath) {
  const writer = fs.createWriteStream(outputLocationPath);

  return axios({
    method: "get",
    url: fileUrl,
    responseType: "stream",
  }).then((response) => {
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on("error", (err) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on("close", () => {
        if (!error) {
          resolve(true);
        }
      });
    });
  });
}

async function downloadAll() {
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    console.log(`Downloading file ${i + 1} out of ${urls.length}`);
    await downloadFile(
      url,
      path.resolve(__dirname, "temp", `file${i + 1}.txt`)
    );
    console.log(`Downloaded file ${i + 1}`);
  }
  console.log("All files downloaded");
}

// Delete old temp files
if (fs.existsSync(directoryPath)) {
  console.log("Deleting old temp files");
  fs.rmSync(directoryPath, { recursive: true, force: true });
}

// Delete old list
if (fs.existsSync(outputPath)) {
  console.log("Deleting old list");
  fs.rmSync(outputPath);
}

// Create the 'temp' directory if it doesn't exist
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath);
}

downloadAll();
