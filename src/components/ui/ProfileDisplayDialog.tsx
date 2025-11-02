import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog";
import { Button } from "./button";

interface ProfileDisplayDialogProps {
  open: boolean;
  profile: { name: string; occupation: string; gender: string };
  onEdit: () => void;
  onClose: () => void;
}

export const ProfileDisplayDialog: React.FC<ProfileDisplayDialogProps> = ({
  open,
  profile,
  onEdit,
  onClose,
}) => (
  <Dialog open={open} onOpenChange={open => !open && onClose()}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>My Profile</DialogTitle>
      </DialogHeader>
      <div className="space-y-2 text-base">
        <div><b>Name:</b> {profile.name}</div>
        <div><b>Occupation:</b> {profile.occupation || <span className="text-muted-foreground">Not set</span>}</div>
        <div><b>Gender:</b> {profile.gender || <span className="text-muted-foreground">Not set</span>}</div>
      </div>
      <DialogFooter className="flex flex-row gap-2 justify-end mt-4">
        <Button variant="outline" onClick={onEdit}>Edit</Button>
        <Button onClick={onClose}>Close</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
