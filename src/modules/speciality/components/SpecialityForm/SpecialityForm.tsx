import { EntryForm } from '../../../catalog/EntryForm';
import { resources } from '../../../catalog/resources';
import type { SpecialityFormProps } from './SpecialityForm.props';

export const SpecialityForm = ({ action, onSaved, setOpen, speciality }: SpecialityFormProps) => (
  <EntryForm
    resource={resources.specialities}
    entry={action === 'update' ? speciality : null}
    onClose={() => setOpen(false)}
    onSaved={() => {
      setOpen(false);
      void onSaved();
    }}
  />
);
