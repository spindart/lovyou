import { Toast, ToastActionElement, ToastProps } from "@/components/ui/toast"
import {
  useToast as useToastHook,
  toast,
} from "@/components/ui/toast-hook"

export {
  type ToastProps,
  type ToastActionElement,
  Toast,
}

export const useToast = useToastHook
export { toast }