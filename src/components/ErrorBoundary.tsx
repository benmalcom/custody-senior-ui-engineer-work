import { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: (error: Error, reset: () => void) => ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean
    error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
        }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo)
    }

    resetError = () => {
        this.setState({
            hasError: false,
            error: null,
        })
    }

    render() {
        if (this.state.hasError && this.state.error) {
            if (this.props.fallback) {
                return this.props.fallback(this.state.error, this.resetError)
            }

            return (
                <div className="flex min-h-screen items-center justify-center bg-[#F5F7FA] px-[24px]">
                    <div className="w-full max-w-[600px] rounded-[12px] bg-white p-[32px] shadow-sm">
                        <div className="mb-[24px] flex items-center gap-[12px]">
                            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-red-100">
                                <svg
                                    className="h-[24px] w-[24px] text-red-600"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                    />
                                </svg>
                            </div>
                            <h1 className="text-[24px] font-semibold text-[#191925]">
                                Something went wrong
                            </h1>
                        </div>

                        <p className="mb-[24px] text-[16px] leading-[24px] text-[#688199]">
                            We encountered an unexpected error. Please try again or contact support if the
                            problem persists.
                        </p>

                        {process.env.NODE_ENV === 'development' && (
                            <div className="mb-[24px] rounded-[8px] bg-red-50 p-[16px]">
                                <p className="mb-[8px] text-[14px] font-semibold text-red-900">
                                    Error Details (Development Only):
                                </p>
                                <p className="font-mono text-[12px] text-red-800">
                                    {this.state.error.message}
                                </p>
                                {this.state.error.stack && (
                                    <pre className="mt-[8px] max-h-[200px] overflow-auto font-mono text-[11px] text-red-700">
                                        {this.state.error.stack}
                                    </pre>
                                )}
                            </div>
                        )}

                        <button
                            onClick={this.resetError}
                            className="h-[48px] w-full rounded-[8px] bg-[#191925] text-[16px] font-medium text-white transition-colors hover:bg-[#191925]/90"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )
        }

        return this.props.children
    }
}
