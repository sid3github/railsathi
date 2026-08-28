// Regenerates the hero renditions from the source PNG.
// Run with `npm run images` after replacing the source art.
import { mkdir, readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

const SOURCE = 'src/assets/indian-express-hero-v2.png'
const OUT = 'src/assets/hero'
// The hero renders at ~835 CSS px at its widest, so 1600 covers 2x on a large
// screen and 900 covers 2x on a phone. Anything larger is wasted bytes.
const WIDTHS = [900, 1600]

await mkdir(OUT, { recursive: true })

for (const width of WIDTHS) {
  const base = sharp(SOURCE).resize({ width, withoutEnlargement: true })
  await base.clone().avif({ quality: 55, effort: 6 }).toFile(join(OUT, `train-${width}.avif`))
  await base.clone().webp({ quality: 78, effort: 6 }).toFile(join(OUT, `train-${width}.webp`))
}

const files = (await readdir(OUT)).sort()
const rows = await Promise.all(
  files.map(async name => `  ${name.padEnd(20)} ${(((await stat(join(OUT, name))).size / 1024)).toFixed(1)} kB`),
)
const original = (await stat(SOURCE)).size / 1024
console.log(`source ${original.toFixed(1)} kB ->`)
console.log(rows.join('\n'))
