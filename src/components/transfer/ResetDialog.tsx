import { Button } from '@/components/ui'
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
        <Button type="button" variant="secondary" onClick={onClose} className="flex-1 h-[45px]">
          Go back
        </Button>
        <Button type="button" variant="primary" onClick={onConfirm} className="flex-1 h-[45px]">
          Yes, start over
        </Button>
      </DialogActions>
    </Dialog>
  )
}
