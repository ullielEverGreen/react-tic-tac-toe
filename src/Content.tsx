import { useSelector } from 'react-redux'
import type { RootState } from './calcStore'

export default function Content() {
  const n = useSelector((s: RootState) => s.n)
  const sum = useSelector((s: RootState) => s.sum)

  return (
    <div>
      <h1>内容展示</h1>
      <div>
        10 + {n} = {sum}
      </div>
    </div>
  )
}
