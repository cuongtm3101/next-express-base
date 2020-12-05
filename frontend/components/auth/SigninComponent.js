import React from "react";
import { useState, useEffect } from "react";
import Router from "next/router";
import { signin, authenticate, isAuth } from "../../actions/auth";
const SigninComponent = (props) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });
  useEffect(() => {
    if (isAuth()) {
      Router.push("/");
    }
  }, []);
  const { email, password, error, loading, message, showForm } = values;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      email,
      password,
    };
    setValues({
      ...values,
      loading: true,
      error: false,
    });
    console.log(user);
    try {
      const res = await signin(user);
      console.log(res);
      if (res.error) {
        setValues({
          ...values,
          error: res.error,
        });
      } else {
        // set token to cookie

        // set user info localstorage

        // authenticate user
        authenticate(res, () => {
          // redirect to index
          Router.push("/");
        });
      }
    } catch (error) {
      setValues({
        ...values,
        error: error.message,
        loading: false,
      });
    }
  };

  const handleChange = (name) => (e) => {
    setValues({
      ...values,
      [name]: e.target.value,
    });
  };

  const showLoading = () => {
    return loading ? (
      <div className='d-flex justify-content-center'>
        <div className='spinner-border text-center' role='status'>
          <span className='sr-only text-center'>Loading...</span>
        </div>
      </div>
    ) : (
      ""
    );
  };
  const showMessage = () => {
    return message ? (
      <div className='alert alert-primary' role='alert'>
        {message}
      </div>
    ) : (
      ""
    );
  };
  const showError = () => {
    return error ? (
      <div className='alert alert-danger' role='alert'>
        {error}
      </div>
    ) : (
      ""
    );
  };

  const signinForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>Email address</label>
          <input
            onChange={handleChange("email")}
            type='email'
            className='form-control'
            id='email'
            placeholder='Enter email'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            onChange={handleChange("password")}
            type='password'
            className='form-control'
            id='password'
            placeholder='Enter password'
          />
        </div>
        <button type='submit' className='btn btn-primary'>
          Submit
        </button>
      </form>
    );
  };
  return (
    <React.Fragment>
      <h3 className='text-center pt-4 pb-4'>Sign in page - Component</h3>
      {showError()}
      {showLoading()}
      {showMessage()}
      {showForm && signinForm()}
    </React.Fragment>
  );
};

export default SigninComponent;
