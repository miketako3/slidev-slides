import {cp, mkdir, readdir} from 'fs/promises';
import {join} from 'path';

const slidesDir = join(process.cwd(), 'slides');
const distDir = join(process.cwd(), 'dist');

/**
 * 特定のスライドディレクトリをビルドし、成果物をコピーする関数
 * @param {string} slideDir - ビルド対象のスライドディレクトリ名
 */
async function buildSlide(slideDir) {
    const slidePath = join(slidesDir, slideDir);
    console.log(`[${slideDir}] 🚀 Building started...`);
    // distディレクトリが無ければ作成
    await mkdir(join(slidePath, 'dist'), {recursive: true});

    try {
        // Bun.spawnを使用してビルドコマンドを実行
        // コマンドと引数を配列で渡す
        const proc = Bun.spawn(
            ['bun', 'slidev', 'build', '--out', 'dist', '--base', `/slidev-slides/${slideDir}/`],
            {
                cwd: slidePath, // 作業ディレクトリを指定
                stdout: 'inherit', // 標準出力を親プロセスに流す
                stderr: 'inherit', // 標準エラー出力を親プロセスに流す
            }
        );

        // プロセスの完了を待つ
        const exitCode = await proc.exited;

        if (exitCode !== 0) {
            // ビルドが失敗した場合はエラーをスロー
            throw new Error(`Build process exited with code ${exitCode}`);
        }

        // 各スライドのdistをルートのdistにコピー
        await cp(join(slidePath, 'dist'), join(distDir, slideDir), {recursive: true});
        console.log(`[${slideDir}] ✅ Build successful!`);
    } catch (error) {
        // エラー内容を充実させて再スローする
        console.error(`[${slideDir}] ❌ Build failed!`);
        throw new Error(`Failed to build ${slideDir}: ${error.message}`);
    }
}

/**
 * メインのビルドプロセス
 */
async function main() {
    try {
        console.log('🔥 Starting build process with Bun...');
        // distディレクトリがなければ作成
        await mkdir(distDir, {recursive: true});

        const slideDirs = (await readdir(slidesDir, {withFileTypes: true}))
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        console.log(`Found ${slideDirs.length} slides to build: ${slideDirs.join(', ')}`);

        // すべてのスライドのビルド処理を並列で実行
        const buildPromises = slideDirs.map(slideDir => buildSlide(slideDir));
        await Promise.all(buildPromises);

        console.log('\n🎉 All slides have been built successfully.');

        // ルートのdistにindex.htmlを生成
        const indexHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slides Index</title>
    <style>
        body { font-family: sans-serif; margin: 2em; background-color: #f8f9fa; }
        h1 { color: #343a40; }
        ul { list-style: none; padding: 0; }
        li { margin: 0.5em 0; }
        a { text-decoration: none; color: #007bff; font-size: 1.2em; }
        a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <h1>Slides</h1>
    <ul>
        ${slideDirs.map(dir => `<li><a href="./${dir}/">${dir}</a></li>`).join('\n          ')}
    </ul>
</body>
</html>
    `;
        // Bun.writeを使用してファイルを書き込む
        await Bun.write(join(distDir, 'index.html'), indexHtml.trim());
        console.log('✅ Generated index.html in root dist.');

        console.log('\n✨ Build process completed successfully!');
    } catch (error) {
        console.error('\n❌ Build process failed:', error.message);
        process.exit(1);
    }
}

main();
