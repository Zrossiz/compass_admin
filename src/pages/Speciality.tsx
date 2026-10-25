import { Layout } from '../shared/components/Layout';
import { Catalog } from '../modules/catalog/Catalog';
import { resources } from '../modules/catalog/resources';
export default function SpecialityPage() {
  return (
    <Layout>
      <Catalog resource={resources.specialities} />
    </Layout>
  );
}
