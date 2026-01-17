import { TransferForm } from '@/components/transfer'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function App() {
    return (
        <ErrorBoundary>
            <div className="min-h-screen pt-[100px]">
                <div className="w-full px-[24px]">
                    <TransferForm />
                </div>
            </div>
        </ErrorBoundary>
    )
}