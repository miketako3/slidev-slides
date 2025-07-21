import {cp, mkdir, readdir, writeFile} from 'fs/promises';
import {exec} from 'child_process';
import {join} from 'path';

const slidesDir = join(process.cwd(), 'slides');
const distDir = join(process.cwd(), 'dist');

async function build() {
    try {
        // distディレクトリがなければ作成
        await mkdir(distDir, {recursive: true});

        const slideDirs = (await readdir(slidesDir, {withFileTypes: true}))
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        for (const slideDir of slideDirs) {
            const slidePath = join(slidesDir, slideDir);
            console.log(`Building ${slideDir}...`);

            // 各スライドのディレクトリで bun run build を実行
            await new Promise<void>((resolve, reject) => {
                const buildProcess = exec(`slidev build --out dist --base /${slideDir}/`, {cwd: slidePath});
                buildProcess.stdout?.pipe(process.stdout);
                buildProcess.stderr?.pipe(process.stderr);
                buildProcess.on('close', (code) => {
                    if (code === 0) {
                        resolve();
                    } else {
                        reject(new Error(`Build failed for ${slideDir} with exit code ${code}`));
                    }
                });
            });

            // 各スライドのdistをルートのdistにコピー
            await cp(join(slidePath, 'dist'), join(distDir, slideDir), {recursive: true});
            console.log(`Built ${slideDir} successfully!`);
        }

        // ルートのdistにindex.htmlを生成
        const indexHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Slides</title>
      </head>
      <body>
        <h1>Slides</h1>
        <ul>
          ${slideDirs.map(dir => `<li><a href="./${dir}/index.html">${dir}</a></li>`).join('')}
        </ul>
      </body>
      </html>
    `;
        await writeFile(join(distDir, 'index.html'), indexHtml);
        console.log('Generated index.html in root dist');

        console.log('All slides built successfully!');
    } catch (error) {
        console.error('Build process failed:', error);
        process.exit(1);
    }
}

build();
