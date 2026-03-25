import _ from 'lodash'
import { useRef, useState, useEffect, useMemo } from 'react'

import useDebounce from './hooks/useDebounce'
import useThrottle from './hooks/useThrottle'

type SearchResult = {
  id: number
  name: string
}

type ScrollItem = {
  id: number
  content: string
  timestamp: string
}

type DashboardUser = {
  id: number
  name: string
  age: number
  city: string
  salary: number
  active: boolean
}

type FormData = {
  username: string
  email: string
  profile: {
    age: string
    city: string
    hobbies: string[]
    settings: {
      notifications: boolean
      darkMode: boolean
      language: string
    }
  }
}

type TaskStatus = 'pending' | 'completed'

type TaskItem = {
  id: number
  name: string
  status: TaskStatus
  selected: boolean
}

// 表格数据分页
const DataTable = () => {
  // 模拟数据
  const allData = Array.from({ length: 53 }, (_, i) => ({
    id: i + 1,
    name: `用户${i + 1}`,
    email: `user${i + 1}@example.com`,
    age: 20 + (i % 30)
  }))

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const paginatedData = _.chunk(allData, pageSize)
  const currentData = paginatedData[currentPage - 1] || []

  const totalPages = paginatedData.length

  return (
    <div style={{ padding: '20px' }}>
      <h2>用户列表</h2>
      <table
        border={1}
        cellPadding="10"
        style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>姓名</th>
            <th>邮箱</th>
            <th>年龄</th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.age}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div
        style={{
          marginTop: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'center'
        }}>
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}>
          上一页
        </button>
        <span>
          第 {currentPage} / {totalPages} 页
        </span>
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}>
          下一页
        </button>
      </div>
    </div>
  )
}

// 防抖
const SearchBox = () => {
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  // 模拟 API 请求
  const searchAPI = async (searchTerm: string) => {
    if (!searchTerm) {
      setResults([])
      return
    }

    setLoading(true)
    // 模拟异步请求
    await new Promise((resolve) => setTimeout(resolve, 500))

    // 模拟搜索结果
    const mockResults = [
      { id: 1, name: `${searchTerm} - 结果1` },
      { id: 2, name: `${searchTerm} - 结果2` },
      { id: 3, name: `${searchTerm} - 结果3` }
    ]

    setResults(mockResults)
    setLoading(false)
  }

  // 使用 _.debounce 防抖
  const debouncedSearch = _.debounce(searchAPI, 500)

  useEffect(() => {
    debouncedSearch(keyword)

    // 清理函数：取消未执行的防抖调用
    return () => {
      debouncedSearch.cancel()
    }
  }, [keyword])

  return (
    <div style={{ padding: '20px' }}>
      <h2>实时搜索</h2>
      <input
        type="text"
        placeholder="输入关键词搜索..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        style={{
          width: '300px',
          padding: '10px',
          fontSize: '16px',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}
      />
      {loading && <p>搜索中...</p>}
      <ul style={{ marginTop: '20px', listStyle: 'none', padding: 0 }}>
        {results.map((result) => (
          <li key={result.id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
            {result.name}
          </li>
        ))}
      </ul>
      <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
        提示：输入内容后，停止输入 500ms 才会触发搜索
      </p>
    </div>
  )
}

// 滚动加载节流
const InfiniteScroll = () => {
  const [items, setItems] = useState<ScrollItem[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const containerRef = useRef<HTMLDivElement | null>(null)

  // 模拟加载数据
  const loadMoreData = async () => {
    if (loading || !hasMore) return

    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // 注意：这里必须使用 setItems(prev => ...) 里的 prev.length 生成 id，
    // 否则在异步/快速触发时可能读到过期的 items.length，导致重复 key。
    setItems((prev) => {
      const startId = prev.length + 1
      const newItems = Array.from({ length: 20 }, (_, i) => ({
        id: startId + i,
        content: `第 ${page} 页 - 第 ${i + 1} 条数据`,
        timestamp: new Date().toLocaleTimeString()
      }))
      return [...prev, ...newItems]
    })

    setPage((prev) => {
      const next = prev + 1
      // 模拟没有更多数据（第5页后停止）
      if (prev >= 5) setHasMore(false)
      return next
    })

    setLoading(false)
  }

  // 使用 _.throttle 节流滚动事件
  const handleScroll = _.throttle(() => {
    if (!containerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    // 距离底部 100px 时加载更多
    if (scrollTop + clientHeight >= scrollHeight - 100 && !loading && hasMore) {
      loadMoreData()
    }
  }, 200)

  // 首次加载
  useEffect(() => {
    loadMoreData()
  }, [])

  return (
    <div style={{ padding: '20px' }}>
      <h2>无限滚动加载</h2>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        style={{
          height: '400px',
          overflowY: 'auto',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '10px'
        }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '15px',
              marginBottom: '10px',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              borderLeft: '3px solid #1890ff'
            }}>
            <div>{item.content}</div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
              {item.timestamp}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
            加载中...
          </div>
        )}
        {!hasMore && (
          <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
            没有更多数据了
          </div>
        )}
      </div>
      <p style={{ color: '#666', fontSize: '12px', marginTop: '10px' }}>
        提示：滚动到底部自动加载更多，节流控制每 200ms 最多触发一次
      </p>
    </div>
  )
}

// 数据统计与聚合
const DataDashboard = () => {
  const [users] = useState<DashboardUser[]>([
    { id: 1, name: '张三', age: 25, city: '北京', salary: 8000, active: true },
    { id: 2, name: '李四', age: 30, city: '上海', salary: 12000, active: false },
    { id: 3, name: '王五', age: 28, city: '北京', salary: 9500, active: true },
    { id: 4, name: '赵六', age: 35, city: '深圳', salary: 15000, active: true },
    { id: 5, name: '周七', age: 32, city: '上海', salary: 11000, active: true },
    { id: 6, name: '吴八', age: 26, city: '深圳', salary: 8500, active: false },
    { id: 7, name: '郑九', age: 29, city: '北京', salary: 10000, active: true }
  ])

  // 统计数据
  const stats = {
    // 活跃用户
    activeUsers: _.filter(users, 'active').length,

    // 按城市分组
    groupByCity: _.groupBy(users, 'city'),

    // 平均薪资
    avgSalary: _.meanBy(users, 'salary'),

    // 最高薪资
    maxSalary: _.maxBy(users, 'salary'),

    // 年龄分布
    ageGroups: _.groupBy(users, (user) => {
      if (user.age < 28) return '青年 (<28)'
      if (user.age < 32) return '壮年 (28-31)'
      return '中年 (≥32)'
    }),

    // 前3高薪用户
    top3Salary: _.take(_.orderBy(users, ['salary'], ['desc']), 3)
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>数据统计看板</h2>

      {/* 统计卡片 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>
        <div style={{ padding: '20px', backgroundColor: '#e6f7ff', borderRadius: '8px' }}>
          <h3>总用户数</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{users.length}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#f6ffed', borderRadius: '8px' }}>
          <h3>活跃用户</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>{stats.activeUsers}</p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#fff7e6', borderRadius: '8px' }}>
          <h3>平均薪资</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>
            ¥{stats.avgSalary.toFixed(0)}
          </p>
        </div>
        <div style={{ padding: '20px', backgroundColor: '#fff1f0', borderRadius: '8px' }}>
          <h3>最高薪资</h3>
          <p style={{ fontSize: '32px', fontWeight: 'bold' }}>
            ¥{stats.maxSalary?.salary ?? 0}
          </p>
          <p style={{ color: '#666' }}>{stats.maxSalary?.name ?? '暂无'}</p>
        </div>
      </div>

      {/* 按城市分组 */}
      <div style={{ marginBottom: '30px' }}>
        <h3>按城市分组</h3>
        {Object.entries(stats.groupByCity).map(([city, users]) => (
          <div
            key={city}
            style={{
              marginBottom: '15px',
              padding: '10px',
              backgroundColor: '#fafafa',
              borderRadius: '4px'
            }}>
            <strong>
              {city} ({users.length}人)
            </strong>
            <ul>
              {users.map((user) => (
                <li key={user.id}>
                  {user.name} - {user.age}岁 - ¥{user.salary}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* 年龄分布 */}
      <div style={{ marginBottom: '30px' }}>
        <h3>年龄分布</h3>
        {Object.entries(stats.ageGroups).map(([group, users]) => (
          <div key={group} style={{ marginBottom: '10px' }}>
            <strong>{group}:</strong> {users.length}人
            <progress
              value={users.length}
              max={users.length}
              style={{ marginLeft: '10px' }}
            />
          </div>
        ))}
      </div>

      {/* TOP3 高薪 */}
      <div>
        <h3>薪资 TOP3</h3>
        <table
          border={1}
          cellPadding="10"
          style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>排名</th>
              <th>姓名</th>
              <th>城市</th>
              <th>年龄</th>
              <th>薪资</th>
            </tr>
          </thead>
          <tbody>
            {stats.top3Salary.map((user, index) => (
              <tr key={user.id}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.city}</td>
                <td>{user.age}</td>
                <td>¥{user.salary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// 深拷贝与表单重置
const UserProfileForm = () => {
  const initialFormData: FormData = {
    username: '',
    email: '',
    profile: {
      age: '',
      city: '',
      hobbies: [],
      settings: {
        notifications: true,
        darkMode: false,
        language: 'zh-CN'
      }
    }
  }

  const [formData, setFormData] = useState(_.cloneDeep(initialFormData))
  const [hasChanges, setHasChanges] = useState(false)

  // 检查是否有未保存的更改
  const checkChanges = (newData: FormData) => {
    const isChanged = !_.isEqual(newData, initialFormData)
    setHasChanges(isChanged)
  }

  const handleChange = (path: string, value: unknown) => {
    const newData = _.cloneDeep(formData)
    _.set(newData, path, value)
    setFormData(newData)
    checkChanges(newData)
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    alert('保存成功！')
    // 这里可以发送请求
    console.log('提交的数据:', _.cloneDeep(formData))
  }

  const handleReset = () => {
    if (hasChanges && !window.confirm('有未保存的更改，确定重置吗？')) {
      return
    }
    setFormData(_.cloneDeep(initialFormData))
    setHasChanges(false)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>用户信息表单</h2>
      {hasChanges && (
        <div
          style={{
            padding: '10px',
            backgroundColor: '#fff7e6',
            borderLeft: '3px solid #faad14',
            marginBottom: '20px'
          }}>
          ⚠️ 您有未保存的更改
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>用户名：</label>
          <input
            type="text"
            value={formData.username}
            onChange={(e) => handleChange('username', e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>邮箱：</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>年龄：</label>
          <input
            type="number"
            value={formData.profile.age}
            onChange={(e) => handleChange('profile.age', e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>城市：</label>
          <select
            value={formData.profile.city}
            onChange={(e) => handleChange('profile.city', e.target.value)}
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
            <option value="">请选择</option>
            <option value="北京">北京</option>
            <option value="上海">上海</option>
            <option value="深圳">深圳</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>通知设置：</label>
          <input
            type="checkbox"
            checked={formData.profile.settings.notifications}
            onChange={(e) =>
              handleChange('profile.settings.notifications', e.target.checked)
            }
            style={{ marginLeft: '10px' }}
          />
          <span style={{ marginLeft: '5px' }}>接收邮件通知</span>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>深色模式：</label>
          <input
            type="checkbox"
            checked={formData.profile.settings.darkMode}
            onChange={(e) => handleChange('profile.settings.darkMode', e.target.checked)}
            style={{ marginLeft: '10px' }}
          />
          <span style={{ marginLeft: '5px' }}>启用深色主题</span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#1890ff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
            保存
          </button>
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '10px 20px',
              backgroundColor: '#f5f5f5',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
            重置
          </button>
        </div>
      </form>
    </div>
  )
}

// 数组操作（多选/批量操作）
const BatchOperations = () => {
  const [items, setItems] = useState<TaskItem[]>([
    { id: 1, name: '任务1', status: 'pending', selected: false },
    { id: 2, name: '任务2', status: 'completed', selected: false },
    { id: 3, name: '任务3', status: 'pending', selected: false },
    { id: 4, name: '任务4', status: 'pending', selected: false },
    { id: 5, name: '任务5', status: 'completed', selected: false }
  ])

  // 获取选中的 ID
  const selectedIds = _.filter(items, 'selected').map((item) => item.id)
  const selectedCount = selectedIds.length

  // 全选/取消全选
  const toggleSelectAll = () => {
    const allSelected = selectedCount === items.length
    setItems((prev) => prev.map((item) => ({ ...item, selected: !allSelected })))
  }

  // 切换单个选中
  const toggleSelect = (id: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    )
  }

  // 批量删除
  const batchDelete = () => {
    if (selectedCount === 0) return
    if (window.confirm(`确定删除 ${selectedCount} 个任务吗？`)) {
      setItems((prev) => prev.filter((item) => !item.selected))
    }
  }

  // 批量修改状态
  const batchUpdateStatus = (newStatus: TaskStatus) => {
    if (selectedCount === 0) return
    setItems((prev) =>
      prev.map((item) => (item.selected ? { ...item, status: newStatus } : item))
    )
  }

  // 统计信息
  const stats = {
    total: items.length,
    pending: _.filter(items, { status: 'pending' }).length,
    completed: _.filter(items, { status: 'completed' }).length,
    selected: selectedCount
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2>批量操作</h2>

      {/* 统计卡片 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '15px',
          marginBottom: '20px'
        }}>
        <div style={{ padding: '15px', backgroundColor: '#e6f7ff', borderRadius: '4px' }}>
          <div>总数</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.total}</div>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#fff7e6', borderRadius: '4px' }}>
          <div>待处理</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.pending}</div>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
          <div>已完成</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.completed}</div>
        </div>
        <div style={{ padding: '15px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
          <div>已选中</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{stats.selected}</div>
        </div>
      </div>

      {/* 批量操作按钮 */}
      {selectedCount > 0 && (
        <div
          style={{
            marginBottom: '20px',
            padding: '15px',
            backgroundColor: '#fafafa',
            borderRadius: '4px'
          }}>
          <span>已选中 {selectedCount} 项，</span>
          <button
            onClick={batchDelete}
            style={{
              marginRight: '10px',
              padding: '5px 10px',
              backgroundColor: '#ff4d4f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
            批量删除
          </button>
          <button
            onClick={() => batchUpdateStatus('completed')}
            style={{
              marginRight: '10px',
              padding: '5px 10px',
              backgroundColor: '#52c41a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
            标记为完成
          </button>
          <button
            onClick={() => batchUpdateStatus('pending')}
            style={{
              padding: '5px 10px',
              backgroundColor: '#faad14',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>
            标记为待处理
          </button>
        </div>
      )}

      {/* 列表 */}
      <div style={{ border: '1px solid #e8e8e8', borderRadius: '4px' }}>
        <div
          style={{
            padding: '10px',
            borderBottom: '1px solid #e8e8e8',
            backgroundColor: '#fafafa'
          }}>
          <input
            type="checkbox"
            checked={selectedCount === items.length && items.length > 0}
            onChange={toggleSelectAll}
          />
          <span style={{ marginLeft: '10px' }}>全选</span>
        </div>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              padding: '10px',
              borderBottom: '1px solid #e8e8e8',
              display: 'flex',
              alignItems: 'center'
            }}>
            <input
              type="checkbox"
              checked={item.selected}
              onChange={() => toggleSelect(item.id)}
            />
            <span style={{ marginLeft: '10px', flex: 1 }}>{item.name}</span>
            <span
              style={{
                padding: '2px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                backgroundColor: item.status === 'completed' ? '#f6ffed' : '#fff7e6',
                color: item.status === 'completed' ? '#52c41a' : '#faad14'
              }}>
              {item.status === 'completed' ? '已完成' : '待处理'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// 缓存计算结果（useMemo + memoize）
const ExpensiveCalculation = () => {
  const [number, setNumber] = useState(10)
  const [count, setCount] = useState(0)

  // 模拟昂贵的计算
  const expensiveCalc = (n: number) => {
    console.log('执行昂贵计算...')
    // 模拟复杂计算
    let result = 0
    for (let i = 0; i < 10000000; i++) {
      result += Math.sqrt(i) * n
    }
    return result.toFixed(2)
  }

  // 使用 lodash 的 memoize 缓存计算结果
  const memoizedCalc = useMemo(() => _.memoize(expensiveCalc), [])

  // 计算结果（相同参数会从缓存读取）
  const result = useMemo(() => memoizedCalc(number), [number, memoizedCalc])

  return (
    <div style={{ padding: '20px' }}>
      <h2>缓存计算结果</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>输入数字：</label>
        <input
          type="number"
          value={number}
          onChange={(e) => setNumber(Number(e.target.value))}
          style={{ marginLeft: '10px', padding: '5px' }}
        />
      </div>

      <div
        style={{
          marginBottom: '20px',
          padding: '15px',
          backgroundColor: '#f0f0f0',
          borderRadius: '4px'
        }}>
        <div>计算结果：{result}</div>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          提示：相同输入只会计算一次
        </div>
      </div>

      <div>
        <button onClick={() => setCount((c) => c + 1)} style={{ padding: '5px 15px' }}>
          无关按钮点击次数: {count}
        </button>
        <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
          提示：点击按钮不会重新计算，只有输入数字变化才会触发计算
        </div>
      </div>
    </div>
  )
}

// useDebounce
const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearch = useDebounce(searchTerm, 500)

  useEffect(() => {
    if (debouncedSearch) {
      console.log('执行搜索:', debouncedSearch)
      // 调用 API
    }
  }, [debouncedSearch])

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="搜索..."
    />
  )
}

// useThrottle
const ScrollComponent = () => {
  const handleScroll = useThrottle(() => {
    console.log('滚动事件', new Date().toLocaleTimeString())
  }, 200)

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return <div style={{ height: '200vh' }}>滚动查看控制台</div>
}

const Lodash = () => {
  return (
    <div>
      <h1>Lodash</h1>
      <DataTable />
      <SearchBox />
      <InfiniteScroll />
      <DataDashboard />
      <UserProfileForm />
      <BatchOperations />
      <ExpensiveCalculation />
      <SearchComponent />
      <ScrollComponent />
    </div>
  )
}

export default Lodash
