import Navbar from '../components/navbar/navbar.component'
import { Outlet } from 'react-router'

export default function Container() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  )
}
