import type { Profession } from '../../types';

export type ProfessionListItemProps = {
  profession: Profession;
  onSaved: () => void | Promise<void>;
};
