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
      `datamodel-codegen --input "${schemaPath}" --output "${pyOutputPath}" --input-file-type jsonschema --output-model-type pydantic_v2.BaseModel --target-python-version 3.10`,
      { stdio: 'inherit' }
    )
    console.log(`  Written to ${pyOutputPath}`)

    // Post-process for Python 3.8 compatibility
    let pyContent = readFileSync(pyOutputPath, 'utf-8')

    // Convert union syntax: X | None -> Optional[X]
    // Also handle: list[X] | None -> Optional[List[X]]
    pyContent = pyContent
      // Convert dict[K, V] to Dict[K, V]
      .replace(/\bdict\[/g, 'Dict[')
      // Convert list[X] to List[X]
      .replace(/\blist\[/g, 'List[')
      // Convert X | None to Optional[X] - match type annotation after colon until | None
      // Use non-greedy match up to " | None"
      .replace(/: (.+?) \| None/g, ': Optional[$1]')

    // Add typing imports after __future__ import
    pyContent = pyContent.replace(
      /^from __future__ import annotations\n/m,
      'from __future__ import annotations\n\nfrom typing import Dict, List, Optional\n'
    )

    const pyHeader = `# AUTO-GENERATED FILE - DO NOT EDIT
# Generated from schema/bundle.schema.json
# Run 'npm run generate:types' to regenerate

# Modified for Python 3.8 compatibility

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
