import React, { forwardRef } from 'react'

export type SpinnerProps = {
  /**
   * ID to find this component in testing tools (e.g.: cypress, testing library, and jest).
   */
  testId?: string
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(function Spinner(
  { children, testId = 'store-spinner', ...otherProps },
  ref
) {
  return (
    <span ref={ref} data-store-spinner data-testid={testId} {...otherProps} />
  )
})

export default Spinner
