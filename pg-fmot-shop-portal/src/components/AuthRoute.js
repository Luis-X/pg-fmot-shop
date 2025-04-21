import { Route, Redirect } from 'react-router-dom';
import Tools from '../utils/tools';

// 使用props 接收值
export default function AuthRoute(props) {
  console.log('AuthRoute');
  console.log(props);
  const Com = props.component;
  return (
    <Route
      path={props.path} // path 设一个活的值 ,使用 props 接收
      render={() => {
        const token = Tools.getToken();
        if (token) {
          return <Com />; // 组件标签使用一个常量进行接收 不能直接写 <props.component/>
        } else {
          return <Redirect to="/result/2" />;
        }
      }}
    />
  );
}
