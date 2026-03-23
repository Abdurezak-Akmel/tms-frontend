import { VerifyEmailForm } from '../../components/auth';
import { Container, Surface } from '../../components/layout';

const VerifyEmail = () => (
  <Surface variant="brand" className="flex min-h-dvh items-center py-10">
    <Container size="md" className="flex justify-center">
      <VerifyEmailForm />
    </Container>
  </Surface>
);

export default VerifyEmail