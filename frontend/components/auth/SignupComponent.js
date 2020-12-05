import React from "react";
import Router from "next/router";
import { useState, useEffect } from "react";
import { signup, isAuth } from "../../actions/auth";
const SignupComponent = (props) => {
  const [values, setValues] = useState({
    email: "",
    password: "",
    name: "",
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
  const { email, password, name, error, loading, message, showForm } = values;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      email,
      password,
      name,
    };
    setValues({
      ...values,
      loading: true,
      error: false,
    });
    console.log(user);
    try {
      const res = await signup(user);
      console.log(res);
      if (res.error) {
        setValues({
          ...values,
          error: res.error,
        });
      } else {
        setValues({
          ...values,
          name: "",
          email: "",
          password: "",
          error: "",
          message: res.message,
          loading: false,
          showForm: false,
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

  const handleChange = (name, value) => {
    setValues({
      ...values,
      [name]: value,
    });
  };

  const showLoading = () => {
    return loading ? (
      <div className='spinner-border' role='status'>
        <span className='sr-only text-center'>Loading...</span>
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

  const signupForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className='form-group'>
          <label htmlFor='email'>Email address</label>
          <input
            onChange={(e) => handleChange("email", e.target.value)}
            type='email'
            className='form-control'
            id='email'
            placeholder='Enter email'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            onChange={(e) => handleChange("password", e.target.value)}
            type='password'
            className='form-control'
            id='password'
            placeholder='Enter password'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='name'>Name</label>
          <input
            onChange={(e) => handleChange("name", e.target.value)}
            type='text'
            className='form-control'
            id='name'
            placeholder='Enter name'
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
      <h3 className='text-center pt-4 pb-4'>Sign up page - Component</h3>
      {showError()}
      {showLoading()}
      {showMessage()}
      {showForm && signupForm()}
    </React.Fragment>
  );
};

export default SignupComponent;
