import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./dialog";
import { Button } from "./button";
import { Input } from "./input";

interface ProfileSetupDialogProps {
  open: boolean;
  initial: { name?: string; occupation?: string; gender?: string };
  onSubmit: (data: { name: string; occupation: string; gender: string }) => void;
  onClose: () => void;
}

export const ProfileSetupDialog: React.FC<ProfileSetupDialogProps> = ({
  open,
  initial,
  onSubmit,
  onClose,
}) => {
  const [name, setName] = React.useState(initial.name || "");
  const [occupation, setOccupation] = React.useState(initial.occupation || "");
  const [gender, setGender] = React.useState(initial.gender || "");

  React.useEffect(() => {
    setName(initial.name || "");
    setOccupation(initial.occupation || "");
    setGender(initial.gender || "");
  }, [initial]);

  return (
    <Dialog open={open} onOpenChange={open => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Up Your Profile</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSubmit({ name, occupation, gender });
          }}
          className="space-y-4"
        >
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <Input value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div>
            <label className="block mb-1 font-medium">Occupation</label>
            <Input value={occupation} onChange={e => setOccupation(e.target.value)} />
          </div>
          <div>
            <label className="block mb-1 font-medium">Gender</label>
            <Input value={gender} onChange={e => setGender(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">Save Profile</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
