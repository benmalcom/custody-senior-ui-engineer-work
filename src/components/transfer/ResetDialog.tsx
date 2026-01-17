import { Dialog, DialogActions, DialogBody } from '@/components/ui/Dialog'

interface ResetDialogProps {
    open: boolean
    onClose: () => void
    onConfirm: () => void
}

export function ResetDialog({ open, onClose, onConfirm }: ResetDialogProps) {
    return (
        <Dialog open={open} onClose={onClose} title="Start over?">
            <DialogBody>
                This will erase everything you've entered so far.
                <br />
                Are you sure you want to reset and start from scratch?
            </DialogBody>
            <DialogActions>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 h-[45px] px-[20px] py-[12px] bg-[rgba(104,129,153,0.3)] rounded-[9px] backdrop-blur-[7.5px] flex items-center justify-center text-[#05284B] text-[16px] font-semibold text-center cursor-pointer hover:bg-[rgba(104,129,153,0.4)] transition-colors"
                    style={{
                        fontFamily: '"Inter Tight"',
                        lineHeight: '120%',
                        fontFeatureSettings: "'liga' off, 'clig' off",
                    }}
                >
                    Go back
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    className="flex-1 h-[45px] px-[13px] py-[12px] bg-[#E2C889] rounded-[9px] flex items-center justify-center text-[#473508] text-[16px] font-semibold text-center cursor-pointer hover:bg-[#d4b97a] transition-colors"
                    style={{
                        fontFamily: '"Inter Tight"',
                        lineHeight: '120%',
                        fontFeatureSettings: "'liga' off, 'clig' off",
                    }}
                >
                    Yes, start over
                </button>
            </DialogActions>
        </Dialog>
    )
}
