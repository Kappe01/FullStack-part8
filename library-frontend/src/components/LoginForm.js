import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../queries";

const LoginForm = ({ show, setToken }) => {
  const [username, setUsername] = useState("kappe");
  const [password, setPassword] = useState("secret");

  const [login] = useMutation(LOGIN);

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();

    const { data } = await login({ variables: { username, password } });

    if (data) {
      const token = data.login.value;
      setToken(token);
      localStorage.setItem("library-user-token", token);
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          username{" "}
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default LoginForm;
