import './App.scss';
import Root from './router/Root';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');

function App() {
  return (
    <ConfigProvider locale={zh_CN}>
      <Root />
    </ConfigProvider>
  );
}

export default App;
