import './index.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';

ReactDOM.render(<App />, document.getElementById('root'))
