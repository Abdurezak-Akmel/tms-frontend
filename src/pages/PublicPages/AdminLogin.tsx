import { AdminLoginForm } from '../../components/auth';
import { Container, Surface } from '../../components/layout';

const AdminLogin = () => (
  <Surface variant="brand" className="flex min-h-dvh items-center py-10">
    <Container size="md" className="flex justify-center">
      <AdminLoginForm />
    </Container>
  </Surface>
);

export default AdminLogin;
