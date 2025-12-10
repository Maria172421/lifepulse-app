import { useState } from 'react';
import { Users, Plus, Trash2, Edit2, Phone, MessageSquare, Bell, X } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useContacts } from '@/hooks/useContacts';
import { EmergencyContact } from '@/types/health';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { cn } from '@/lib/utils';

interface ContactFormData {
  name: string;
  relationship: string;
  phone_number: string;
  notify_sms: boolean;
  notify_call: boolean;
  notify_app: boolean;
}

const initialFormData: ContactFormData = {
  name: '',
  relationship: '',
  phone_number: '',
  notify_sms: true,
  notify_call: true,
  notify_app: true,
};

const ContactCard = ({
  contact,
  onEdit,
  onDelete,
}: {
  contact: EmergencyContact;
  onEdit: (contact: EmergencyContact) => void;
  onDelete: (id: string) => void;
}) => {
  return (
    <div className="rounded-2xl bg-card p-5 border border-border/50 transition-all duration-200 hover:shadow-md animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-primary/10 p-3 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">{contact.name}</h3>
            <p className="text-sm text-muted-foreground">{contact.relationship}</p>
            <p className="text-sm font-medium mt-1">{contact.phone_number}</p>
            
            <div className="flex items-center gap-3 mt-3">
              <div className={cn(
                'flex items-center gap-1 text-xs',
                contact.notify_sms ? 'text-primary' : 'text-muted-foreground'
              )}>
                <MessageSquare className="h-3.5 w-3.5" />
                SMS
              </div>
              <div className={cn(
                'flex items-center gap-1 text-xs',
                contact.notify_call ? 'text-primary' : 'text-muted-foreground'
              )}>
                <Phone className="h-3.5 w-3.5" />
                Call
              </div>
              <div className={cn(
                'flex items-center gap-1 text-xs',
                contact.notify_app ? 'text-primary' : 'text-muted-foreground'
              )}>
                <Bell className="h-3.5 w-3.5" />
                App
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => onEdit(contact)}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Contact</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to remove {contact.name} from your emergency contacts? 
                  They will no longer be notified in case of emergencies.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => onDelete(contact.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
};

const Contacts = () => {
  const { contacts, loading, addContact, updateContact, deleteContact } = useContacts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);

  const handleOpenDialog = (contact?: EmergencyContact) => {
    if (contact) {
      setEditingContact(contact);
      setFormData({
        name: contact.name,
        relationship: contact.relationship,
        phone_number: contact.phone_number,
        notify_sms: contact.notify_sms,
        notify_call: contact.notify_call,
        notify_app: contact.notify_app,
      });
    } else {
      setEditingContact(null);
      setFormData(initialFormData);
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingContact) {
      await updateContact(editingContact.id, formData);
    } else {
      await addContact(formData);
    }
    
    setDialogOpen(false);
    setFormData(initialFormData);
    setEditingContact(null);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold">Emergency Contacts</h1>
            <p className="text-muted-foreground mt-1">
              Manage contacts who will be notified in emergencies
            </p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Contact
              </Button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="John Doe"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    placeholder="Son, Daughter, Caregiver..."
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    placeholder="+1 (555) 123-4567"
                    required
                  />
                </div>
                
                <div className="space-y-4">
                  <Label>Notification Methods</Label>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">SMS Notification</span>
                    </div>
                    <Switch
                      checked={formData.notify_sms}
                      onCheckedChange={(checked) => setFormData({ ...formData, notify_sms: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Phone Call</span>
                    </div>
                    <Switch
                      checked={formData.notify_call}
                      onCheckedChange={(checked) => setFormData({ ...formData, notify_call: checked })}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">App Notification</span>
                    </div>
                    <Switch
                      checked={formData.notify_app}
                      onCheckedChange={(checked) => setFormData({ ...formData, notify_app: checked })}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1">
                    {editingContact ? 'Save Changes' : 'Add Contact'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Contacts List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-muted/50 animate-pulse" />
            ))}
          </div>
        ) : contacts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {contacts.map((contact, index) => (
              <div key={contact.id} style={{ animationDelay: `${index * 100}ms` }}>
                <ContactCard
                  contact={contact}
                  onEdit={handleOpenDialog}
                  onDelete={deleteContact}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-card p-12 text-center border border-border/50 animate-fade-in">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Emergency Contacts</h3>
            <p className="text-muted-foreground mb-6">
              Add contacts who should be notified in case of health emergencies
            </p>
            <Button onClick={() => handleOpenDialog()} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Your First Contact
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Contacts;
