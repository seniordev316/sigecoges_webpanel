import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Button, Icon, IconButton, InputAdornment, TextField } from '@material-ui/core';
import { submitLoginWithFireBase } from 'app/auth/store/loginSlice';
import * as yup from 'yup';
import FuseLoading from '@fuse/core/FuseLoading';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  email: yup.string().email('You must enter a valid email').required('You must enter a email'),
  password: yup.string().required('Please enter your password.'),
});

const defaultValues = {
  email: '',
  password: '',
};

function FirebaseLoginTab(props) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const login = useSelector(({ auth }) => auth.login);

  const { control, setValue, formState, handleSubmit, reset, trigger, setError } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  const [showPassword, setShowPassword] = useState(false);

  const formRef = useRef(null);

  useEffect(() => {
    if (login) {
      if (login.errors.length > 0) {
        setLoading(true);
        login.errors.forEach((error) => {
          setError(error.type, {
            type: 'manual',
            message: error.message,
          });
        });
      } else {
        setLoading(true);
        setError(login.errors.type, {
          type: 'manual',
          message: login.errors.message,
        });
      }
    }
  }, [login.errors, setError]);

  function onSubmit(model) {
    dispatch(submitLoginWithFireBase(model)).then(() => setLoading(false));
  }
  if (!loading) {
    return <FuseLoading />;
  }
  return (
    <div className="w-full">
      <form className="flex flex-col justify-center w-full" onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-16"
              type="text"
              label="Email"
              error={!!errors.email}
              helperText={errors?.email?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Icon className="text-20" color="action">
                      email
                    </Icon>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              required
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              className="mb-16"
              type="password"
              label="Password"
              error={!!errors.password}
              helperText={errors?.password?.message}
              InputProps={{
                className: 'pr-2',
                type: showPassword ? 'text' : 'password',
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      <Icon className="text-20" color="action">
                        {showPassword ? 'visibility' : 'visibility_off'}
                      </Icon>
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              variant="outlined"
              required
            />
          )}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="w-full mx-auto mt-16"
          aria-label="LOG IN"
          value="firebase"
        >
          Login
        </Button>
      </form>
    </div>
  );
}

export default FirebaseLoginTab;
