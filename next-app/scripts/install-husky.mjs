import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import install from 'husky'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = resolve(__dirname, '..', '..')

try {
  process.chdir(repoRoot)
  const result = install('next-app/.husky')
  if (result) {
    console.warn(result)
  }
} catch (error) {
  console.error('Failed to install Husky hooks:', error)
  process.exitCode = 1
}
