import { Route, Routes } from 'react-router';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { pages } from './routes';

const { services: Services, serviceDetail: ServiceDetail, references: References, company: Company, contact: Contact, notFound: NotFound } = pages;

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="palvelut" element={<Services />} />
        <Route path="palvelut/:slug" element={<ServiceDetail />} />
        <Route path="referenssit" element={<References />} />
        <Route path="yritys" element={<Company />} />
        <Route path="yhteystiedot" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
