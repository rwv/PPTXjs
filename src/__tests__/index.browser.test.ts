import { describe, expect, test } from 'vitest'

import { getPageElementsFromPPTX } from '../index'
import SamplePptx from './example.pptx?url'

describe('PPTXjs Loading', () => {
  test('should load pptx file', async () => {
    const response = await fetch(SamplePptx)
    const blob = await response.blob()

    expect(blob).toBeDefined()
    expect(blob.size).toBeGreaterThan(0)
  })

  test('should parse pptx and get slides', async () => {
    // The library works in production but fails in test environment due to
    // Sizzle selector engine issue: "X[g].exec is not a function"

    const response = await fetch(SamplePptx)
    const blob = await response.blob()

    try {
      const { pages, element } = await getPageElementsFromPPTX(blob)

      // Use native assertions to avoid vitest expect issues
      if (!pages || pages.length === 0) {
        throw new Error('No pages found')
      }

      // Verify slides are in the DOM
      const allSlidesWrapper = document.getElementById('all_slides_warpper')
      if (!allSlidesWrapper) {
        throw new Error('all_slides_warpper not found')
      }

      // Check that we have actual slide elements
      const slideElements = document.querySelectorAll('.slide')
      if (slideElements.length === 0) {
        throw new Error('No slide elements found')
      }

      console.log(`✓ Successfully loaded ${pages.length} slides`)

      // Clean up
      element.remove()
    } catch (error) {
      console.error('Test failed:', error)
      throw error
    }
  }, 60000) // 60 second timeout
})
