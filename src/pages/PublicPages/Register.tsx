import { RegisterForm } from '../../components/auth';
import { Container, Surface } from '../../components/layout';
import { ButtonLink } from '../../components/ui/ButtonLink';
import { ArrowLeft } from 'lucide-react';

const Register = () => (
    <Surface variant="brand" className="flex min-h-dvh flex-col py-10">
        <Container size="lg" className="mb-4 w-full">
            <ButtonLink
                to="/"
                variant="ghost"
                size="sm"
                leftIcon={<ArrowLeft className="size-4" />}
                className="text-white hover:bg-white/10"
            >
                Back to landing page
            </ButtonLink>
        </Container>
        <Container size="md" className="flex flex-1 flex-col items-center justify-center">
            <RegisterForm />
        </Container>
    </Surface>
);

export default Register