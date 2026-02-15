#!/usr/bin/env node
/**
 * Generate TypeScript types from JSON Schema.
 * Run with: node schema/generate.js
 */

import { compile } from 'json-schema-to-typescript'
import { readFileSync, writeFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const schemaPath = join(__dirname, 'bundle.schema.json')
const tsOutputPath = join(__dirname, '..', 'src', 'data', 'bundle.generated.ts')

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

  console.log('Done!')
}

main().catch(console.error)
