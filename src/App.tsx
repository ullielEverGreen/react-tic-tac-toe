import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import Board from './Board'
import './App.css'
import Children from './Children'
import { ThemeProvider, useTheme } from './ThemeContext'
import Heading from './Heading'
import Section from './Section'

// 深层嵌套组件
function DeepButton() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      // style={{
      //   background: theme === 'light' ? 'black' : 'light',
      //   color: theme === 'light' ? '#000' : '#ea0e0eff'
      // }}
    >
      当前主题色：{theme}
    </button>
  )
}

// 中间组件（不需要传递props）
function MiddleComponent() {
  return (
    <div>
      <h2>中间组件</h2>
      <DeepButton />
    </div>
  )
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button className="counter" onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </button>
      </section> */}

      <Children />

      <ThemeProvider>
        <div>Context api</div>
        <MiddleComponent />
      </ThemeProvider>

      <Section>
        <Heading>主标题</Heading>
        <Section>
          <Heading>副标题</Heading>
          <Heading>副标题</Heading>
          <Heading>副标题</Heading>
          <Section>
            <Heading>子标题</Heading>
            <Heading>子标题</Heading>
            <Heading>子标题</Heading>
            <Section>
              <Heading>子子标题</Heading>
              <Heading>子子标题</Heading>
              <Heading>子子标题</Heading>
            </Section>
          </Section>
        </Section>
      </Section>

      {/* <div className="ticks">
        <Board />
      </div> */}

      {/* <section id="next-steps">
        <div id="docs">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#documentation-icon"></use>
          </svg>
          <h2>Documentation</h2>
          <p>Your questions, answered</p>
          <ul>
            <li>
              <a href="https://vite.dev/" target="_blank">
                <img className="logo" src={viteLogo} alt="" />
                Explore Vite
              </a>
            </li>
            <li>
              <a href="https://react.dev/" target="_blank">
                <img className="button-icon" src={reactLogo} alt="" />
                Learn more
              </a>
            </li>
          </ul>
        </div>
        <div id="social">
          <svg className="icon" role="presentation" aria-hidden="true">
            <use href="/icons.svg#social-icon"></use>
          </svg>
          <h2>Connect with us</h2>
          <p>Join the Vite community</p>
          <ul>
            <li>
              <a href="https://github.com/vitejs/vite" target="_blank">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#github-icon"></use>
                </svg>
                GitHub
              </a>
            </li>
            <li>
              <a href="https://chat.vite.dev/" target="_blank">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#discord-icon"></use>
                </svg>
                Discord
              </a>
            </li>
            <li>
              <a href="https://x.com/vite_js" target="_blank">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#x-icon"></use>
                </svg>
                X.com
              </a>
            </li>
            <li>
              <a href="https://bsky.app/profile/vite.dev" target="_blank">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href="/icons.svg#bluesky-icon"></use>
                </svg>
                Bluesky
              </a>
            </li>
          </ul>
        </div>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section> */}
    </>
  )
}

export default App
