import type { Profession } from '../../types';

export type ProfessionFormProps = {
  setOpen: (open: boolean) => void;
  onSaved: () => void | Promise<void>;
  action: 'create' | 'update';
  profession: Profession | null;
};
