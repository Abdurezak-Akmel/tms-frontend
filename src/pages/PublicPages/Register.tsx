import { RegisterForm } from '../../components/auth';
import { Container, Surface } from '../../components/layout';

const Register = () => (
  <Surface variant="brand" className="flex min-h-dvh items-center py-10">
    <Container size="md" className="flex justify-center">
      <RegisterForm />
    </Container>
  </Surface>
);

export default Register