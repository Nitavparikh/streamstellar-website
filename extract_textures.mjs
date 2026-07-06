import fs from 'fs';
const buf = fs.readFileSync('public/models/cutter_machine.glb');
const jsonLen = buf.readUInt32LE(12);
const json = JSON.parse(buf.slice(20, 20 + jsonLen).toString('utf8'));
const binStart = 20 + jsonLen + 8;
function extractBufferView(index) {
  const bv = json.bufferViews[index];
  return buf.slice(binStart + bv.byteOffset, binStart + bv.byteOffset + bv.byteLength);
}
const names = ['diffuse', 'specularGloss', 'normal', 'occlusion'];
json.images.forEach((img, i) => {
  const data = extractBufferView(img.bufferView);
  fs.writeFileSync('public/models/cutter_' + names[i] + '.png', data);
  console.log('Wrote', names[i], data.length, 'bytes');
});
