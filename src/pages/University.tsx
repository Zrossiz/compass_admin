import { Layout } from '../shared/components/Layout';
import { Catalog } from '../modules/catalog/Catalog';
import { resources } from '../modules/catalog/resources';
export default function UniversityPage() {
  return (
    <Layout>
      <Catalog resource={resources.universities} />
    </Layout>
  );
}
