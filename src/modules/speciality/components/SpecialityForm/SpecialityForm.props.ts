import type { Speciality } from '../../types';

export type SpecialityFormProps = {
  setOpen: (open: boolean) => void;
  onSaved: () => void | Promise<void>;
  action: 'create' | 'update';
  speciality: Speciality | null;
};
