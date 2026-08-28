import { Outlet } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import { SkipLink } from './components/SkipLink'

export function RootLayout() {
  return (
    <>
      <SkipLink />
      <ScrollToTop />
      <Outlet />
    </>
  )
}
