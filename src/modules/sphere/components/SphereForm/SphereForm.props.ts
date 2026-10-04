import type { Sphere } from '../../types';

export type SphereFormProps = {
  setOpen: (open: boolean) => void;
  onSaved: () => void;
  action: 'create' | 'update';
  sphere: Sphere | null;
};
