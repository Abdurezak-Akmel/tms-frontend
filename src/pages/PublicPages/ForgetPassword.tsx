import { ForgetPasswordForm } from '../../components/auth';
import { Container, Surface } from '../../components/layout';

const ForgetPassword = () => (
  <Surface variant="brand" className="flex min-h-dvh items-center py-10">
    <Container size="md" className="flex justify-center">
      <ForgetPasswordForm />
    </Container>
  </Surface>
);

export default ForgetPassword