'use client'

import { useToastStore, Toast as ToastType } from '@/store/toastStore'
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

export function ToastContainer() {
    const { toasts } = useToastStore()

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} />
            ))}
        </div>
    )
}

function ToastItem({ toast }: { toast: ToastType }) {
    const { removeToast } = useToastStore()
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        setIsVisible(true)
    }, [])

    const handleClose = () => {
        setIsVisible(false)
        setTimeout(() => removeToast(toast.id), 300)
    }

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        error: <AlertCircle className="w-5 h-5 text-rose-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    }

    const backgrounds = {
        success: 'bg-emerald-500/10 border-emerald-500/20',
        error: 'bg-rose-500/10 border-rose-500/20',
        info: 'bg-blue-500/10 border-blue-500/20',
        warning: 'bg-amber-500/10 border-amber-500/20',
    }

    return (
        <div
            className={cn(
                "pointer-events-auto flex items-center justify-between p-4 rounded-2xl border glass-panel shadow-lg transition-all duration-300 transform",
                backgrounds[toast.type],
                isVisible ? "translate-x-0 opacity-100" : "translate-x-8 opacity-0"
            )}
        >
            <div className="flex items-center gap-3">
                {icons[toast.type]}
                <p className="text-sm font-bold text-foreground">{toast.message}</p>
            </div>
            <button
                onClick={handleClose}
                className="p-1 rounded-lg hover:bg-muted/50 transition-colors"
            >
                <X className="w-4 h-4 text-muted-foreground" />
            </button>
        </div>
    )
}
