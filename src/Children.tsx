import heroImg from './assets/hero.png'

function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <div className="card">
      <h2>{title}</h2>
      <div className="card-content">{children}</div>
    </div>
  )
}

function Children() {
  return (
    <Card title="card组件的title">
      <img src={heroImg} className="base" width="170" height="179" alt="" />
      <div>这一块就是children的内容，使用习惯类似Vue的插槽</div>
    </Card>
  )
}

export default Children
