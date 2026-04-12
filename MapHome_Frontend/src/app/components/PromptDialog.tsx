import { AnimatePresence, motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface PromptDialogProps {
  open: boolean;
  title?: string;
  placeholder?: string;
  defaultValue?: string;
  submitText?: string;
  cancelText?: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export function PromptDialog({
  open,
  title = "Nhập thông tin",
  placeholder = "",
  defaultValue = "",
  submitText = "Xác nhận",
  cancelText = "Huỷ",
  onSubmit,
  onCancel,
}: PromptDialogProps) {
  const [value, setValue] = useState(defaultValue || "");

  useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue, open]);

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
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm flex flex-col gap-4 relative"
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

            <h3 className="text-lg font-bold text-slate-800">{title}</h3>

            <input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />

            <div className="flex gap-3 mt-2 w-full justify-end">
              <button
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200"
                onClick={onCancel}
              >
                {cancelText}
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700"
                onClick={() => onSubmit(value)}
              >
                {submitText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default PromptDialog;
