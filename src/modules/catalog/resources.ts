export type Entry = {
  id: number;
  title: string;
  description?: string;
  sphereId?: number;
  professionId?: number;
  specialityId?: number;
  region?: string;
  videoLink?: string;
  imageLink?: string;
  sortOrder?: number;
  linkId?: number;
};
export type Field = {
  key: string;
  label: string;
  type?: 'textarea' | 'number' | 'url' | 'file';
  min?: number;
  max?: number;
  source?: string;
};
export type Resource = {
  title: string;
  singular: string;
  description: string;
  endpoint: string;
  paginated?: boolean;
  fields: Field[];
  parent?: { key: string; label: string; source: string };
  kind?: 'profession' | 'speciality' | 'track' | 'interview';
};
const title: Field = { key: 'title', label: 'Название', min: 3, max: 255 };
const description: Field = {
  key: 'description',
  label: 'Описание',
  type: 'textarea',
  min: 8,
  max: 10000,
};
export const resources: Record<string, Resource> = {
  spheres: {
    title: 'Сферы',
    singular: 'Сфера',
    description: 'Большие направления, с которых начинается выбор будущего.',
    endpoint: 'spheres',
    fields: [title, description],
  },
  professions: {
    title: 'Профессии',
    singular: 'Профессия',
    description: 'Расскажите, чем занимаются специалисты и кому подойдёт их работа.',
    endpoint: 'professions',
    paginated: true,
    kind: 'profession',
    parent: { key: 'sphereId', label: 'Сфера', source: 'spheres' },
    fields: [{ key: 'sphereId', label: 'Сфера', source: 'spheres' }, title, description],
  },
  specialities: {
    title: 'Специальности',
    singular: 'Специальность',
    description: 'Образовательные направления и пути к выбранной профессии.',
    endpoint: 'specialties',
    paginated: true,
    kind: 'speciality',
    parent: { key: 'professionId', label: 'Профессия', source: 'professions' },
    fields: [
      { key: 'professionId', label: 'Профессия', source: 'professions' },
      title,
      { ...description, min: 1 },
    ],
  },
  universities: {
    title: 'Вузы',
    singular: 'Вуз',
    description: 'Учебные заведения, в которых можно получить специальность.',
    endpoint: 'university',
    fields: [
      { ...title, min: 2 },
      { key: 'region', label: 'Регион', min: 2, max: 255 },
      { ...description, min: 1 },
    ],
  },
};
export function interviewResource(kind: 'profession' | 'speciality'): Resource {
  return {
    title: 'Интервью',
    singular: 'Интервью',
    description: 'Видео с экспертами. Порядок определяет расположение в каталоге.',
    endpoint: `${kind}-interview`,
    kind: 'interview',
    fields: [
      { ...title, min: 1 },
      { key: 'videoLink', label: 'Ссылка на видео', type: 'url', max: 255 },
      { key: 'order', label: 'Порядок', type: 'number', min: 0 },
    ],
  };
}
export const trackResource: Resource = {
  title: 'Траектории',
  singular: 'Траектория',
  description: 'Наглядные шаги обучения и профессионального развития.',
  endpoint: 'speciality-track',
  kind: 'track',
  fields: [
    { ...title, min: 1 },
    { key: 'sortOrder', label: 'Порядок', type: 'number', min: 0 },
    { key: 'file', label: 'Изображение', type: 'file' },
  ],
};
