import { createContext, type ReactNode, useContext } from 'react'
import { FONT_STYLES } from '@/lib/styles'

// Context to ensure children are used inside Dialog
const DialogContext = createContext<boolean>(false)

function useDialogContext(componentName: string) {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error(`<${componentName}> must be used inside <Dialog>`)
  }
  return context
}

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children?: ReactNode
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  if (!open) return null

  return (
    <DialogContext.Provider value={true}>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-50"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onClose()
        }}
        role="button"
        tabIndex={0}
        aria-label="Close dialog"
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className="w-[685px] px-[50px] py-[25px] flex flex-col justify-center items-center gap-[10px] rounded-[20px] bg-[#F9F7F5]"
          style={{
            boxShadow: '0px 4px 20px 0px rgba(104, 129, 153, 0.30)',
            backdropFilter: 'blur(20px)',
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {/* Content */}
          <div className="self-stretch py-[25px] flex flex-col items-center">
            <div className="flex flex-col items-center gap-[25px]">
              {/* Title */}
              <h2
                className="text-[#191925] text-[40px] font-semibold leading-[120%] text-center"
                style={FONT_STYLES}
              >
                {title}
              </h2>

              {/* Body - flexible content */}
              {children}
            </div>
          </div>
        </div>
      </div>
    </DialogContext.Provider>
  )
}

interface DialogBodyProps {
  children: ReactNode
}

export function DialogBody({ children }: DialogBodyProps) {
  useDialogContext('DialogBody')

  return (
    <div
      className="text-[#90A0AF] text-[16px] font-medium text-center leading-[120%]"
      style={FONT_STYLES}
    >
      {children}
    </div>
  )
}

interface DialogActionsProps {
  children: ReactNode
}

export function DialogActions({ children }: DialogActionsProps) {
  useDialogContext('DialogActions')

  return <div className="w-[450px] flex items-center gap-[15px]">{children}</div>
}
