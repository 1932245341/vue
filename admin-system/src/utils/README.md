# 工具函数库

本目录包含了项目中使用的各种工具函数，用于提高代码复用性和简化常见操作。

## 目录结构

```
utils/
├── business.js    # 业务相关工具函数
├── format.js      # 格式化工具函数
├── index.js       # 入口文件，导出所有工具函数
├── request.js     # HTTP请求工具函数
├── storage.js     # 本地存储管理工具
├── validate.js    # 数据验证工具函数
└── README.md      # 说明文档
```

## 使用方式

### 方式一：按需导入

```javascript
// 导入特定工具函数
import { formatDate } from '@/utils/format'
import { isValidPhone } from '@/utils/validate'
import { setLocal, getLocal } from '@/utils/storage'
import { get, post } from '@/utils/request'

// 使用示例
formatDate(new Date(), 'YYYY-MM-DD')
isValidPhone('13800138000')
setLocal('userInfo', { name: 'Admin' })
get('/api/users')
```

### 方式二：导入模块

```javascript
// 导入整个模块
import { format, validate, storage, request } from '@/utils'

// 使用示例
format.formatDate(new Date(), 'YYYY-MM-DD')
validate.isValidPhone('13800138000')
storage.setLocal('userInfo', { name: 'Admin' })
request.get('/api/users')
```

### 方式三：导入所有

```javascript
// 导入所有工具函数
import utils from '@/utils'

// 使用示例
utils.formatDate(new Date(), 'YYYY-MM-DD')
utils.isValidPhone('13800138000')
utils.setLocal('userInfo', { name: 'Admin' })
utils.get('/api/users')
```

## 主要功能

### 存储管理 (storage.js)

- `setLocal(key, value, expire)`: 设置localStorage，支持过期时间
- `getLocal(key)`: 获取localStorage，自动处理过期情况
- `removeLocal(key)`: 移除localStorage
- `clearLocal()`: 清空所有localStorage
- `setSession(key, value)`: 设置sessionStorage
- `getSession(key)`: 获取sessionStorage
- `removeSession(key)`: 移除sessionStorage
- `clearSession()`: 清空所有sessionStorage

### 格式化工具 (format.js)

- `formatDate(date, format)`: 格式化日期
- `formatMoney(num, decimals)`: 格式化金额为千分位
- `formatFileSize(bytes, decimals)`: 格式化文件大小
- `formatPhone(phone)`: 格式化手机号码
- `formatBankCard(cardNo)`: 格式化银行卡号

### 数据验证 (validate.js)

- `isValidPhone(phone)`: 验证手机号
- `isValidEmail(email)`: 验证邮箱
- `isValidIDCard(idCard)`: 验证身份证号
- `isValidURL(url)`: 验证URL
- `isValidPassword(password, options)`: 验证密码强度
- `isEmpty(value)`: 验证是否为空值
- `isNumber(value)`: 验证是否为数字
- `isInteger(value)`: 验证是否为整数

### HTTP请求 (request.js)

- `get(url, params, config)`: GET请求
- `post(url, data, config)`: POST请求
- `put(url, data, config)`: PUT请求
- `del(url, params, config)`: DELETE请求
- `upload(url, formData, onProgress)`: 上传文件
- `download(url, params, filename)`: 下载文件

### 通用工具 (index.js)

- `debounce(fn, delay)`: 防抖函数
- `throttle(fn, delay)`: 节流函数
- `deepClone(obj)`: 深拷贝对象
- `generateUniqueId(length)`: 生成唯一ID
- `getUrlParam(name, url)`: 获取URL参数
- `copyToClipboard(text)`: 复制文本到剪贴板

### 业务工具 (business.js)

- `listToTree(list, options)`: 将列表数据转换为树形结构
- `treeToList(tree, options)`: 树形结构数据扁平化
- `findNodeById(tree, id, options)`: 根据ID查找树形结构中的节点
- `getParentIds(tree, id, options)`: 获取所有父节点ID
- `filterTree(tree, predicate, options)`: 根据条件过滤树形结构
- `exportExcel(data, options)`: 导出Excel文件
- `randomColor(format)`: 生成随机颜色