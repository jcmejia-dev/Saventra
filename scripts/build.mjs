import { mkdir, copyFile } from 'node:fs/promises';
import { build } from 'esbuild';
await mkdir('dist',{recursive:true});
for(const file of ['index.html','styles.css','.nojekyll']) await copyFile(file,`dist/${file}`);
await build({entryPoints:['app.js'],bundle:true,format:'esm',platform:'browser',target:'es2022',outfile:'dist/app.js',minify:true});
console.log('Built static site and bundled managed-auth client.');
