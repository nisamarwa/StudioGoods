import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Divider,
  Checkbox,
  Anchor,
  Stack,
  ActionIcon,
} from '@mantine/core';
import { GoogleButton } from './GoogleButton';
import classes from './AuthenticationPage.module.css'
import useFirebaseAuth from '@/lib/Authentication';

export function AuthenticationForm({ setModalOpen }) {
  const [type, toggle] = useToggle(['login', 'register', 'forgotPassword']);
  const {createUserWithEmail, signInWithEmail, SendPasswordResetEmail} = useFirebaseAuth();
  const form = useForm({
    initialValues: {
      email: '',
      name: '',
      password: '',
      terms: true,
    },
    
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      name: (val) => (form.values.type === 'register' && val.length <= 2 ? 'Username should include at least 3 characters' : null),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });
  
  const handleRegister = async(values) =>{
    await createUserWithEmail(values).then(()=>{
      console.log("SUKSES ga", );
      setModalOpen(false);
    });
  }

  const handleLogin = async(values) => {
    console.log("KESIni", values)
    await signInWithEmail(values).then(()=>{
      console.log("LOGIN SUCESS");
      setModalOpen(false);
    })
  }

  const handleForgetPassword = async (values) => {
    console.log("FORGET PASSWORD", values);
    await SendPasswordResetEmail(values).then(()=>{
      console.log("Check your email!");
    })
  };


  const handleButton = (values) =>{
    console.log("HANDLE BUTTON")
    if(type=='register'){
      console.log("REGISTER", type)
      handleRegister(values)
    }
    else if(type === 'login'){
      console.log("SIGN IN", type)
      handleLogin(values)
    }
    else if (type === 'forgotPassword') {
      console.log("FORGET PASSWORD", type);
      handleForgetPassword(values);
    }
  }

  return (
    <Paper radius="md" p="xl" withBorder size='xl' className={classes.paper}>
      <Text size="lg" fw={500}>
      Welcome to StudioGoods, {type === 'forgotPassword' ? 'Reset Password' : upperFirst(type)} with
      </Text>

      {type === 'login' &&(
      <>
      <Group grow mb="md" mt="md">
        <GoogleButton radius="xl"/>
      </Group>

      <Divider label="Or continue with email" labelPosition="center" my="lg" />
      </>
      )}

      <form >
        <Stack>
          {type === 'register' && (
            <TextInput
              required
              label="Name"
              placeholder="Your name"
              value={form.values.name}
              onChange={(event) => form.setFieldValue('name', event.currentTarget.value)}
              error={form.errors.name && 'Name should include at least 3 characters'}
              radius="md"
            />
          )}

          {/* {type !== 'forgotPassword' && ( */}
          <TextInput
            required 
            label="Email"
            placeholder="hello@mantine.dev"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            // error={form.errors.email && 'Invalid email'}
            radius="md"
            {...form.getInputProps('email')}
          />
          {/* )} */}

          {type !== 'forgotPassword' && (
          <PasswordInput
            required
            label="Password"
            placeholder="Your password"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />
          )}

          {type === 'register' && (
            <Checkbox
              label="I accept terms and conditions"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
            />
          )}
        </Stack>
          
        <Group justify="space-between" mt="xl">

          <Anchor component="button" type="button" size="xs" c="dimmed" onClick={() => {
           if(type === 'register') toggle('login');
           else toggle('register');
           }}>
            {type === 'register' ? 'Already have an account? Login' : (type === 'login' ? "Don't have an account? Register" : '')}
          </Anchor>

          {((type==='login') || type === 'forgotPassword') && (
            <Anchor component='button' type='button' c='dimmed' onClick={() => {
              if(type==='forgotPassword') toggle('login')
              else toggle('forgotPassword')
            }} size='xs'>
              {(type === 'forgotPassword') ? 'Back to Login' : 'Forget your password?'}
            </Anchor>
           )} 

          <Button radius="xl" 
          type='submit' 
          onClick={(event)=>{
            event.preventDefault();
            const validationErrors = form.validate();
            if(!validationErrors.hasErrors) handleButton(form.values)
          }}
          >
          {type === 'forgotPassword' ? 'Reset Password' : upperFirst(type)}
          </Button>
        </Group>
        </form>  
    </Paper>
  );
}