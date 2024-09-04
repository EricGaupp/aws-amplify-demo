import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'

import App from './App'

test('renders a button', () => {
    render(<App />)
    expect(
        screen.getByRole('button', { name: /add todo/i })
    ).toBeInTheDocument()
})
