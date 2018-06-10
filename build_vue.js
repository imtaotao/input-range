const fs = require('fs');
const path = require('path');

const file_name = "slide.vue";

const source_path = path.join(__dirname, '/lib/vue/',  file_name);
const copy_path = path.join(__dirname, '/build/vue', file_name);

const read_stream = fs.createReadStream(source_path);
const write_stream = fs.createWriteStream(copy_path);
read_stream.pipe(write_stream);