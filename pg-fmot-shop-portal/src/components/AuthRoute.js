import {Route, Redirect} from 'react-router-dom'

// 使用props 接收值
export default function AuthRoute(props) {
    const Com = props.component
    return (
        <Route path={props.path} // path 设一个活的值 ,使用 props 接收
               render={() => {
                   if (localStorage.getItem('token')) {
                       return <Com/> // 组件标签使用一个常量进行接收 不能直接写 <props.component/>
                   } else {
                       return <Redirect to="/result/2"/>
                   }
               }}
        />
    )
}
