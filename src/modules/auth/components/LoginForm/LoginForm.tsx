import { useState } from "react";
import styles from './LoginForm.module.scss';
import { login } from "../../api";

export const LoginForm = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [err, setErr] = useState<string>("");

  const submit = async () => {
    try {
      await login(username, password);
    } catch (error: unknown) {
      setErr(String(error));
    }
  }

  return (
    <div className={styles.wrapper}>
      <input 
        type="text" 
        value={username} 
        onChange={(e) => setUsername(e.target.value)} 
        placeholder={"Имя пользователя"} 
      />
      <input 
        type="password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        placeholder={"Пароль"} 
      />
      {err != "" && (
        <span>{err}</span>
      )}
      <button onClick={submit}>Войти</button>
    </div>
  )
};
