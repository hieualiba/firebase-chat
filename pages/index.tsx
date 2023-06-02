import { Inter } from 'next/font/google'
import Sidebar from '../components/Sidebar'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div
      className={`flex max-h-screen p-16 ${inter.className}`}
    >
      <Sidebar />
      <h1>box chat</h1>
    </div>
  )
}
