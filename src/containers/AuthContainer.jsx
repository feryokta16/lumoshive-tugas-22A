import React, { useEffect, useState } from "react";
import LoginModal from "../components/LoginModal";
import { login, register } from "../utils/api";

const AuthContainer = ({ setToken }) => {
  // state = {
  //   isLogin: true,
  //   form: {
  //     username: "",
  //     password: "",
  //   },
  //   loading: false,
  //   error: null,
  // };
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
    }
  }, [setToken]);

  // componentDidMount() {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     this.props.setToken(token);
  //   }
  // }

  const toggleLogin = () => {
    // this.setState({ isLogin: !this.state.isLogin, error: null });
    setIsLogin((prevState) => !prevState);
    setError(null);
  };

  const handleChange = (e) => {
    // this.setState({
    //   form: {
    //     ...this.state.form,
    //     [e.target.name]: e.target.value,
    //   },
    // });
    setForm((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isLogin) {
      login(form)
        .then((res) => {
          localStorage.setItem("token", res.getToken);
          setToken(res.getToken);
          setError(null);
          setForm({
            username: "",
            password: "",
          });
        })
        .catch((err) => {
          setError(err.response.data.error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      register(form)
        .then(() => {
          alert("Register Success");
          setIsLogin(true);
          setError(null);
          setForm({
            username: "",
            password: "",
          });
        })
        .catch((err) => {
          setError(err.response.data.error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <div>
      <LoginModal
        form={form}
        loading={loading}
        error={error}
        handleChange={handleChange}
        isLogin={isLogin}
        toggleLogin={toggleLogin}
        handleSubmit={handleSubmit}
      />
    </div>
  );
};

export default AuthContainer;
