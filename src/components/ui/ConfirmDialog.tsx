
import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog";
import { Button } from "./button";
import { LogOut } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = "Are you sure?",
  description = "Are you sure you want to sign out?",
  onConfirm,
  onCancel,
  confirmText = "Yes",
  cancelText = "No",
}) => (
  <Dialog open={open} onOpenChange={open => !open && onCancel()}>
    <DialogContent>
      <DialogHeader>
        <div className="flex flex-col items-center justify-center gap-2">
          <LogOut className="w-10 h-10 text-destructive mb-1" />
          <DialogTitle className="text-center w-full">{title}</DialogTitle>
        </div>
      </DialogHeader>
      <div className="py-2 text-center text-muted-foreground text-base">{description}</div>
      <DialogFooter className="flex flex-row gap-4 justify-center mt-2">
        <Button variant="outline" onClick={onCancel} className="min-w-[80px]">{cancelText}</Button>
        <Button variant="destructive" onClick={onConfirm} className="min-w-[80px]">{confirmText}</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
