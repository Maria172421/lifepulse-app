import { Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface SOSButtonProps {
  onTrigger: () => void;
}

export const SOSButton = ({ onTrigger }: SOSButtonProps) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="sos" size="xl" className="w-full md:w-auto min-w-[200px] h-16 text-xl sos-glow">
          <Phone className="h-6 w-6" />
          SOS Emergency
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-destructive flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Trigger SOS Emergency?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This will immediately notify all your emergency contacts via SMS, call, and app notification. 
            Only use this in a real emergency situation.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onTrigger}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Confirm SOS
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
