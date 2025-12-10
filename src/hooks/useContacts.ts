import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { EmergencyContact } from '@/types/health';
import { toast } from '@/hooks/use-toast';

export const useContacts = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchContacts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('emergency_contacts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching contacts:', error);
      return;
    }

    setContacts((data || []) as EmergencyContact[]);
    setLoading(false);
  };

  const addContact = async (contact: Omit<EmergencyContact, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('emergency_contacts')
      .insert({
        user_id: user.id,
        ...contact,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to add contact',
        variant: 'destructive',
      });
      return null;
    }

    toast({
      title: 'Contact Added',
      description: `${contact.name} has been added to your emergency contacts.`,
    });

    await fetchContacts();
    return data;
  };

  const updateContact = async (id: string, updates: Partial<EmergencyContact>) => {
    const { error } = await supabase
      .from('emergency_contacts')
      .update(updates)
      .eq('id', id);

    if (error) {
      console.error('Error updating contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to update contact',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Contact Updated',
      description: 'Emergency contact has been updated.',
    });

    await fetchContacts();
  };

  const deleteContact = async (id: string) => {
    const { error } = await supabase
      .from('emergency_contacts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting contact:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete contact',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Contact Deleted',
      description: 'Emergency contact has been removed.',
    });

    await fetchContacts();
  };

  useEffect(() => {
    if (user) {
      fetchContacts();
    }
  }, [user]);

  return {
    contacts,
    loading,
    fetchContacts,
    addContact,
    updateContact,
    deleteContact,
  };
};
