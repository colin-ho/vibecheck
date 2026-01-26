#!/usr/bin/env node
/**
 * Generate TypeScript and Python types from JSON Schema.
 * Run with: node schema/generate.js
 */

import { compile } from 'json-schema-to-typescript'
import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const schemaPath = join(__dirname, 'bundle.schema.json')
const tsOutputPath = join(__dirname, '..', 'src', 'data', 'bundle.generated.ts')
const pyOutputPath = join(__dirname, '..', 'skill', 'scripts', 'bundle_types.py')

async function main() {
  const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'))

  // Generate TypeScript
  console.log('Generating TypeScript types...')
  const tsTypes = await compile(schema, 'AnonymousBundle', {
    bannerComment: `/* eslint-disable */
/**
 * AUTO-GENERATED FILE - DO NOT EDIT
 * Generated from schema/bundle.schema.json
 * Run 'npm run generate:types' to regenerate
 */`,
    additionalProperties: false,
    strictIndexSignatures: false,
  })
  writeFileSync(tsOutputPath, tsTypes)
  console.log(`  Written to ${tsOutputPath}`)

  // Generate Python using datamodel-code-generator
  console.log('Generating Python types...')
  try {
    execSync(
      `datamodel-codegen --input "${schemaPath}" --output "${pyOutputPath}" --input-file-type jsonschema --output-model-type pydantic_v2.BaseModel --use-standard-collections --use-union-operator --target-python-version 3.10`,
      { stdio: 'inherit' }
    )
    console.log(`  Written to ${pyOutputPath}`)

    // Add header comment to Python file
    const pyContent = readFileSync(pyOutputPath, 'utf-8')
    const pyHeader = `# AUTO-GENERATED FILE - DO NOT EDIT
# Generated from schema/bundle.schema.json
# Run 'npm run generate:types' to regenerate

`
    writeFileSync(pyOutputPath, pyHeader + pyContent)
  } catch (e) {
    console.error('  Failed to generate Python types.')
    console.error('  Install datamodel-code-generator: pip install datamodel-code-generator')
    process.exit(1)
  }

  console.log('Done!')
}

main().catch(console.error)
