const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

function build_vue () {
  return new Promise((resolve) => {
    const file_name = "slide.vue";

    const source_path = path.join(__dirname, '/lib/vue/',  file_name);
    const copy_path = path.join(__dirname, '/build/vue', file_name);

    const read_stream = fs.createReadStream(source_path);
    const write_stream = fs.createWriteStream(copy_path);

    read_stream.pipe(write_stream);
    read_stream.on('end', (err) => {
      if (err) {
        console.log(err + '\n');
        return;
      }
      resolve();
    })
  })
}

function compress_tgz () {
  child_process.spawn('tar', ['-zcvf', './binaries/Source code.tar.gz', './build'])
}

function compress_zip () {
  child_process.spawn('zip', ['-q', '-r', './binaries/Source code.zip', './build']);
}

build_vue().then(() => {
  // linux or mac
  compress_zip();
  compress_tgz();
})