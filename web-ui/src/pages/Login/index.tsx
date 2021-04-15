import React, { useState } from 'react';
import { useHistory } from 'ice';
import fetch, { AUTH_KEY } from '@/common/fetch';
import { Button, Form, Input, message } from 'antd';
import styles from './index.module.scss';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  function handleSingIn(values) {
    setLoading(true);
    fetch({
      url: '/auth/login',
      params: {
        username: values.username,
        password: values.password,
      },
    })
      .then(res => {
        localStorage.setItem(AUTH_KEY, res.data.token);
        message.success('sign in success');

        setTimeout(() => {
          setLoading(false);
          history.push('/home');
        }, 1000);
      })
      .catch(e => {
        message.error(e.message);
        setLoading(false);
      });
  }

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <Form className={styles.form} layout="vertical" onFinish={handleSingIn}>
          <h2 style={{ textAlign: 'center' }}>Photo Lord</h2>
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button loading={loading} style={{ width: '100%' }} type="primary" htmlType="submit">Sign in</Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
