import { useDispatch, useSelector } from 'react-redux'
import { setN, type AppDispatch, type RootState } from './calcStore'

export default function Calc10() {
  const n = useSelector((s: RootState) => s.n)
  const dispatch = useDispatch<AppDispatch>()

  return (
    <div id="calc10">
      <input
        type="number"
        placeholder="输入数字"
        onChange={(e) => dispatch(setN(Number(e.target.value) || 0))}
      />
      <div>
        10 + {n} = {10 + n}
      </div>
    </div>
  )
}

