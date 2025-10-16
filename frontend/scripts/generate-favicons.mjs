import { promises as fs } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import favicons from 'favicons'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Source image (use the D logo in public)
const source = path.resolve(__dirname, '../public/D logo.png')
const outDir = path.resolve(__dirname, '../public')

const configuration = {
  path: '/',
  appName: 'Dyligent',
  appShortName: 'Dyligent',
  appDescription: 'Your Dyligent team builds, manages, and elevates your digital world.',
  developerName: 'Dyligent',
  developerURL: 'https://www.dyligent.solutions',
  icons: {
    android: false,
    appleIcon: true,
    appleStartup: false,
    coast: false,
    favicons: true,
    firefox: false,
    windows: false,
    yandex: false
  }
}

async function main() {
  try {
    const { images, files /*, html */ } = await favicons(source, configuration)

    // Write generated images (includes favicon.ico, favicon-32x32.png, favicon-16x16.png, apple-touch-icon.png)
    await Promise.all(
      images.map(async (img) => {
        const fp = path.join(outDir, img.name)
        await fs.writeFile(fp, img.contents)
        console.log('Wrote', fp)
      })
    )

    // Write any files (e.g., manifest) if produced
    await Promise.all(
      files.map(async (f) => {
        const fp = path.join(outDir, f.name)
        await fs.writeFile(fp, f.contents)
        console.log('Wrote', fp)
      })
    )

    console.log('Favicons generated into', outDir)
  } catch (err) {
    console.error('Favicons generation failed:', err)
    process.exit(1)
  }
}

main()
