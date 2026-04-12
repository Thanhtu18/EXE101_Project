import { ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XCircle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  icon?: ReactNode;
}

export function ConfirmDialog({
  open,
  title = "Xác nhận thao tác",
  description = "Bạn có chắc chắn muốn thực hiện thao tác này?",
  confirmText = "Xác nhận",
  cancelText = "Huỷ",
  onConfirm,
  onCancel,
  icon,
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-xs md:max-w-sm flex flex-col items-center gap-4 relative"
            initial={{ scale: 0.95, y: 40, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 40, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.35 }}
          >
            <button
              className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition-colors"
              onClick={onCancel}
              aria-label="Đóng"
            >
              <XCircle className="size-6" />
            </button>
            {icon || <XCircle className="size-10 text-rose-500 mb-2" />}
            <h2 className="text-lg font-bold text-slate-800 text-center">
              {title}
            </h2>
            <p className="text-sm text-slate-500 text-center mb-2">
              {description}
            </p>
            <div className="flex gap-3 mt-2 w-full justify-center">
              <button
                className="px-4 py-2 rounded-lg bg-rose-500 text-white font-semibold shadow hover:bg-rose-600 transition-all"
                onClick={onConfirm}
              >
                {confirmText}
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-500 font-semibold shadow hover:bg-slate-200 transition-all"
                onClick={onCancel}
              >
                {cancelText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
