#!/usr/bin/env node
/**
 * Pre-commit hook to verify generated types are in sync with schema.
 * Exits with code 1 if regeneration is needed.
 */

import { compile } from 'json-schema-to-typescript'
import { readFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const schemaPath = join(__dirname, 'bundle.schema.json')
const tsOutputPath = join(__dirname, '..', 'src', 'data', 'bundle.generated.ts')
const pyOutputPath = join(__dirname, '..', 'skill', 'scripts', 'bundle_types.py')

async function main() {
  const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'))

  // Check TypeScript
  const expectedTs = await compile(schema, 'AnonymousBundle', {
    bannerComment: `/* eslint-disable */
/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Generated from schema/bundle.schema.json
 * Run 'npm run generate:types' to regenerate
 */`,
    additionalProperties: false,
    strictIndexSignatures: false,
  })

  if (!existsSync(tsOutputPath)) {
    console.error('ERROR: src/data/bundle.generated.ts does not exist')
    console.error('Run: npm run generate:types')
    process.exit(1)
  }

  const actualTs = readFileSync(tsOutputPath, 'utf-8')
  if (actualTs !== expectedTs) {
    console.error('ERROR: src/data/bundle.generated.ts is out of sync with schema')
    console.error('Run: npm run generate:types')
    process.exit(1)
  }

  // Check Python (just verify file exists and has the header)
  if (!existsSync(pyOutputPath)) {
    console.error('ERROR: skill/scripts/bundle_types.py does not exist')
    console.error('Run: npm run generate:types')
    process.exit(1)
  }

  const actualPy = readFileSync(pyOutputPath, 'utf-8')
  if (!actualPy.includes('AUTO-GENERATED FILE')) {
    console.error('ERROR: skill/scripts/bundle_types.py appears to be manually edited')
    console.error('Run: npm run generate:types')
    process.exit(1)
  }

  console.log('✓ Generated types are in sync with schema')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
