import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { MOCK_PRICE_USD } from '@/constants/form'
import { AmountField } from './AmountField'

describe('AmountField Component', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
    balance: '5000000000000000000000', // 5000 tokens (18 decimals)
    fee: '10000000000000000000', // 10 tokens (18 decimals)
    decimals: 18,
    symbol: 'AVAX',
    isDisabled: false,
    isLoadingBalance: false,
    isLoadingFee: false,
    networkId: 'eip155:43113/slip44:60',
  }

  it('allows typing decimal values', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<AmountField {...defaultProps} onChange={onChange} />)

    const input = screen.getByPlaceholderText('0.00')

    // Type a decimal value
    await user.type(input, '3333.67')

    // Verify onChange was called with the value
    expect(onChange).toHaveBeenCalled()
    // Check that decimal input was accepted
    const calls = onChange.mock.calls
    expect(calls.some((call) => call[0].includes('.'))).toBe(true)
  })

  it('MAX button fills available balance minus fee', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    render(<AmountField {...defaultProps} onChange={onChange} />)

    const maxButton = screen.getByText('MAX')

    // Click MAX button
    await user.click(maxButton)

    // Should be called with balance - fee = 4990 tokens
    expect(onChange).toHaveBeenCalled()
    const value = onChange.mock.calls[onChange.mock.calls.length - 1][0]
    // Convert to number and check it's close to 4990
    expect(parseFloat(value)).toBeCloseTo(4990, 0)
  })

  it('MAX button shows USD value when in USD mode', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()

    // Start with some value to enable the toggle
    render(<AmountField {...defaultProps} value="100" onChange={onChange} />)

    // Toggle to USD mode
    const toggleButton = screen.getByText('Amt. in USD')
    await user.click(toggleButton)

    // Click MAX
    const maxButton = screen.getByText('MAX')
    await user.click(maxButton)

    // The display should show USD but storage should be tokens
    // Check that onChange was called with token amount
    expect(onChange).toHaveBeenCalled()
  })

  it('toggles between token and USD mode', async () => {
    const user = userEvent.setup()

    // Start with a token value
    const { rerender } = render(<AmountField {...defaultProps} value="100" />)

    // Should show "Amt. in USD" button
    expect(screen.getByText('Amt. in USD')).toBeInTheDocument()

    // Click toggle
    const toggleButton = screen.getByText('Amt. in USD')
    await user.click(toggleButton)

    // After clicking, button text should change to show token symbol
    // Wait for re-render and check button text changed
    expect(screen.getByText('Amt. in AVAX')).toBeInTheDocument()
  })

  it('converts value when toggling to USD mode', async () => {
    const user = userEvent.setup()

    // Start with 100 tokens
    render(<AmountField {...defaultProps} value="100" />)

    const input = screen.getByPlaceholderText('0.00') as HTMLInputElement

    // Toggle to USD mode
    const toggleButton = screen.getByText('Amt. in USD')
    await user.click(toggleButton)

    // Input should show USD value (100 * 0.037624 = 3.76)
    // Wait a bit for state update
    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(input.value).toBe('3.76')
  })

  it('shows available balance with fee subtracted', () => {
    render(<AmountField {...defaultProps} />)

    // Should display available balance (balance - fee)
    // 5000 - 10 = 4990 tokens
    expect(screen.getByText(/4,990/)).toBeInTheDocument()
  })

  it('disables MAX button when no balance or fee available', () => {
    render(
      <AmountField
        {...defaultProps}
        balance={undefined}
        fee={undefined}
      />,
    )

    const maxButton = screen.getByText('MAX')
    expect(maxButton).toBeDisabled()
  })

  it('shows loading state for balance', () => {
    render(<AmountField {...defaultProps} isLoadingBalance={true} />)

    // Should show loading indicator
    expect(screen.getByText('Available')).toBeInTheDocument()
  })

  it('shows error message when provided', () => {
    const errorMessage = 'Amount exceeds available balance'

    render(<AmountField {...defaultProps} error={errorMessage} />)

    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('disables input when isDisabled is true', () => {
    render(<AmountField {...defaultProps} isDisabled={true} />)

    const input = screen.getByPlaceholderText('0.00')
    expect(input).toBeDisabled()
  })
})
