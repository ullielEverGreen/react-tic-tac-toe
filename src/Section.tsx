import { useContext } from 'react'
import { LevelContext } from './LevelContext'

type SectionType = {
  children: React.ReactNode
}

export default function Section({ children }: SectionType) {
  const level = useContext(LevelContext)

  return (
    <section className="section">
      <LevelContext value={level + 1}>{children}</LevelContext>
    </section>
  )
}
