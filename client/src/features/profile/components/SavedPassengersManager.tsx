import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../profile.api';
import { SavedPassenger } from '@/features/auth/auth.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users,
  Plus,
  Trash2,
  Edit2,
  X,
  CreditCard,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const SavedPassengersManager: React.FC = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPassenger, setEditingPassenger] = useState<SavedPassenger | null>(null);

  // Form states
  const [title, setTitle] = useState('Mr');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<'MALE' | 'FEMALE' | 'OTHER'>('MALE');
  const [nationality, setNationality] = useState('US');
  const [passportNumber, setPassportNumber] = useState('');
  const [passportExpiry, setPassportExpiry] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const { data: passengers = [], isLoading } = useQuery({
    queryKey: ['savedPassengers'],
    queryFn: () => profileApi.getSavedPassengers(),
  });

  const saveMutation = useMutation({
    mutationFn: (data: any) => {
      if (editingPassenger) {
        return profileApi.updateSavedPassenger(editingPassenger.id, data);
      }
      return profileApi.createSavedPassenger(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedPassengers'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      closeModal();
    },
    onError: (err: any) => {
      setFormError(err.response?.data?.message || 'Failed to save passenger');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => profileApi.deleteSavedPassenger(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedPassengers'] });
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });

  const openAddModal = () => {
    setEditingPassenger(null);
    setTitle('Mr');
    setFirstName('');
    setLastName('');
    setDateOfBirth('1990-05-15');
    setGender('MALE');
    setNationality('US');
    setPassportNumber('');
    setPassportExpiry('2032-10-20');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (p: SavedPassenger) => {
    setEditingPassenger(p);
    setTitle(p.title || 'Mr');
    setFirstName(p.firstName);
    setLastName(p.lastName);
    setDateOfBirth(p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '');
    setGender(p.gender as any || 'MALE');
    setNationality(p.nationality || 'US');
    setPassportNumber(p.passportNumber || '');
    setPassportExpiry(p.passportExpiry ? p.passportExpiry.split('T')[0] : '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPassenger(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setFormError('First and last name are required');
      return;
    }

    saveMutation.mutate({
      type: 'ADULT',
      title,
      firstName,
      lastName,
      dateOfBirth: dateOfBirth || null,
      gender,
      nationality,
      passportNumber: passportNumber || null,
      passportExpiry: passportExpiry || null,
    });
  };

  return (
    <div className="p-6 rounded-3xl glass-panel shadow-sm space-y-5 border border-border/70">
      <div className="flex items-center justify-between pb-3 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-sky-500" />
          <h3 className="font-bold text-base">Saved Frequent Travelers</h3>
        </div>

        <Button
          size="sm"
          onClick={openAddModal}
          className="rounded-xl flex items-center gap-1.5 text-xs font-semibold"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Traveler
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Frequent travelers saved here appear as 1-click autofill options when booking any flight offer.
      </p>

      {/* Passengers Grid */}
      {isLoading ? (
        <div className="py-8 text-center text-xs text-muted-foreground">
          Loading saved travelers...
        </div>
      ) : passengers.length === 0 ? (
        <div className="py-8 text-center border border-dashed border-border/80 rounded-2xl p-6 space-y-2">
          <p className="text-sm font-semibold text-foreground">No saved travelers yet</p>
          <p className="text-xs text-muted-foreground">
            Save family members, colleagues, or frequent travel partners for faster checkout.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {passengers.map((p) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-card border border-border/70 shadow-xs flex items-start justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-foreground">
                    {p.title} {p.firstName} {p.lastName}
                  </span>
                  <span className="text-[10px] uppercase font-bold bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                    {p.nationality || 'US'}
                  </span>
                </div>

                <p className="text-xs text-muted-foreground">
                  Passport: <strong>{p.passportNumber ? `•••• ${p.passportNumber.slice(-4)}` : 'Not recorded'}</strong>
                </p>

                {p.passportExpiry && (
                  <p className="text-[11px] text-muted-foreground">
                    Expires: {new Date(p.passportExpiry).toLocaleDateString([], { month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(p)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-sky-500 hover:bg-muted transition-colors"
                  title="Edit passenger"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => deleteMutation.mutate(p.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete passenger"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <h3 className="font-bold text-base">
                {editingPassenger ? 'Edit Saved Traveler' : 'Add Frequent Traveler'}
              </h3>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1 space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Title</label>
                  <select
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-11 px-2 rounded-xl border border-input bg-card text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Mr">Mr.</option>
                    <option value="Ms">Ms.</option>
                    <option value="Mrs">Mrs.</option>
                    <option value="Dr">Dr.</option>
                  </select>
                </div>

                <div className="col-span-3 grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground">First Name</label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Alex"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-muted-foreground">Last Name</label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Morgan"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Date of Birth</label>
                  <Input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Nationality</label>
                  <Input
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="US"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Passport Number</label>
                  <Input
                    value={passportNumber}
                    onChange={(e) => setPassportNumber(e.target.value)}
                    placeholder="E98273641"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-muted-foreground">Passport Expiry</label>
                  <Input
                    type="date"
                    value={passportExpiry}
                    onChange={(e) => setPassportExpiry(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="ghost" onClick={closeModal}>
                  Cancel
                </Button>
                <Button type="submit" disabled={saveMutation.isPending}>
                  {saveMutation.isPending ? 'Saving...' : 'Save Traveler'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
