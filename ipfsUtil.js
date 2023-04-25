const ipfsClient = require('ipfs-http-client');

// create an instance of the IPFS client
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' });

// upload a file to IPFS
async function uploadFileToIPFS(file) {
  const fileData = await readFileAsBuffer(file);

  const result = await ipfs.add(fileData);

  return result.cid.toString();
}

// read a file as a buffer
function readFileAsBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = reject;

    reader.readAsArrayBuffer(file);
  });
}

module.exports = { uploadFileToIPFS };
