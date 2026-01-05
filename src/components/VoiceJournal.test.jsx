import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import VoiceJournal from './VoiceJournal'

describe('VoiceJournal', () => {
  it('renders title and buttons', () => {
    render(<VoiceJournal />)
    expect(screen.getByText(/Voice Journal/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Start recording/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Stop recording/i })).toBeInTheDocument()
  })
})
