/**
 * 业务相关工具函数
 */

/**
 * 将列表数据转换为树形结构
 * @param {Array} list 列表数据
 * @param {Object} options 配置项
 * @param {string} options.id ID字段名，默认为'id'
 * @param {string} options.parentId 父ID字段名，默认为'parentId'
 * @param {string} options.children 子节点字段名，默认为'children'
 * @returns {Array} 树形结构数据
 */
export const listToTree = (list, options = {}) => {
  const {
    id = 'id',
    parentId = 'parentId',
    children = 'children'
  } = options

  const tree = []
  const map = {}

  // 先将数据转成map形式
  list.forEach(item => {
    map[item[id]] = { ...item }
  })

  // 构建树形结构
  list.forEach(item => {
    const parent = map[item[parentId]]
    if (parent) {
      // 有父节点，作为子节点添加
      if (!parent[children]) {
        parent[children] = []
      }
      parent[children].push(map[item[id]])
    } else {
      // 没有父节点，作为根节点
      tree.push(map[item[id]])
    }
  })

  return tree
}

/**
 * 树形结构数据扁平化
 * @param {Array} tree 树形结构数据
 * @param {Object} options 配置项
 * @param {string} options.children 子节点字段名，默认为'children'
 * @returns {Array} 扁平化后的列表数据
 */
export const treeToList = (tree, options = {}) => {
  const { children = 'children' } = options
  const result = []
  const dfs = (nodes) => {
    if (!nodes) return
    nodes.forEach(node => {
      const newNode = { ...node }
      if (newNode[children]) {
        dfs(newNode[children])
        delete newNode[children]
      }
      result.push(newNode)
    })
  }
  dfs(tree)
  return result
}

/**
 * 根据ID查找树形结构中的节点
 * @param {Array} tree 树形结构数据
 * @param {string|number} id 节点ID
 * @param {Object} options 配置项
 * @param {string} options.id ID字段名，默认为'id'
 * @param {string} options.children 子节点字段名，默认为'children'
 * @returns {Object|null} 找到的节点或null
 */
export const findNodeById = (tree, id, options = {}) => {
  const {
    idField = 'id',
    children = 'children'
  } = options

  let result = null
  const dfs = (nodes) => {
    if (!nodes || result) return
    for (const node of nodes) {
      if (node[idField] === id) {
        result = node
        return
      }
      if (node[children]) {
        dfs(node[children])
      }
    }
  }
  dfs(tree)
  return result
}

/**
 * 获取所有父节点ID
 * @param {Array} tree 树形结构数据
 * @param {string|number} id 节点ID
 * @param {Object} options 配置项
 * @param {string} options.id ID字段名，默认为'id'
 * @param {string} options.parentId 父ID字段名，默认为'parentId'
 * @param {string} options.children 子节点字段名，默认为'children'
 * @returns {Array} 父节点ID数组
 */
export const getParentIds = (tree, id, options = {}) => {
  const {
    idField = 'id',
    children = 'children'
  } = options

  const parentIds = []
  const findParents = (nodes, targetId, path = []) => {
    for (const node of nodes) {
      // 当前路径
      const currentPath = [...path, node[idField]]
      
      // 找到目标节点
      if (node[idField] === targetId) {
        return currentPath.slice(0, -1) // 不包含自身
      }
      
      // 递归查找子节点
      if (node[children] && node[children].length > 0) {
        const result = findParents(node[children], targetId, currentPath)
        if (result.length) {
          return result
        }
      }
    }
    return []
  }
  
  return findParents(tree, id)
}

/**
 * 根据条件过滤树形结构
 * @param {Array} tree 树形结构数据
 * @param {Function} predicate 过滤条件函数
 * @param {Object} options 配置项
 * @param {string} options.children 子节点字段名，默认为'children'
 * @returns {Array} 过滤后的树形结构
 */
export const filterTree = (tree, predicate, options = {}) => {
  const { children = 'children' } = options
  
  return tree
    .filter(node => predicate(node))
    .map(node => {
      // 创建节点副本
      const newNode = { ...node }
      
      // 如果有子节点，递归过滤
      if (node[children]) {
        const filteredChildren = filterTree(node[children], predicate, options)
        // 只有当过滤后的子节点数组非空时，才添加到新节点
        if (filteredChildren.length > 0) {
          newNode[children] = filteredChildren
        } else {
          delete newNode[children]
        }
      }
      
      return newNode
    })
}

/**
 * 导出Excel文件
 * @param {Array} data 数据数组
 * @param {Object} options 配置项
 * @param {string} options.filename 文件名，默认为'export.xlsx'
 * @param {Array} options.columns 列配置，格式为[{label: '显示名', prop: '字段名'}]
 */
export const exportExcel = (data, options = {}) => {
  const {
    filename = 'export.xlsx',
    columns = []
  } = options
  
  // 这里仅提供一个简单的CSV导出实现
  // 实际项目中建议使用xlsx或其他专业库
  
  // 生成CSV内容
  const header = columns.map(col => col.label).join(',')
  const rows = data.map(item => {
    return columns.map(col => {
      // 处理可能包含逗号的内容
      const cellValue = item[col.prop] != null ? item[col.prop] : ''
      return typeof cellValue === 'string' && cellValue.includes(',') 
        ? `"${cellValue}"`
        : cellValue
    }).join(',')
  })
  
  const csvContent = [header, ...rows].join('\n')
  
  // 创建下载链接
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * 生成随机颜色
 * @param {string} format 颜色格式，支持'hex'、'rgb'，默认为'hex'
 * @returns {string} 颜色值
 */
export const randomColor = (format = 'hex') => {
  const r = Math.floor(Math.random() * 256)
  const g = Math.floor(Math.random() * 256)
  const b = Math.floor(Math.random() * 256)
  
  if (format === 'rgb') {
    return `rgb(${r}, ${g}, ${b})`
  }
  
  // 默认返回hex格式
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}