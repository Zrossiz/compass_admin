import type { Speciality } from '../../types';

export type SpecialityListItemProps = {
  speciality: Speciality;
  onSaved: () => void | Promise<void>;
};
