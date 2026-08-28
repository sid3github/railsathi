import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from './RootLayout'
import { JourneyLayout } from './layouts/JourneyLayout'
import { CallbackConfirmedScreen } from './screens/CallbackConfirmedScreen'
import { CallbackScreen } from './screens/CallbackScreen'
import { ErrorScreen } from './screens/ErrorScreen'
import { HomeScreen } from './screens/HomeScreen'
import { NotFoundScreen } from './screens/NotFoundScreen'
import { OptionsScreen } from './screens/OptionsScreen'
import { RebookConfirmedScreen } from './screens/RebookConfirmedScreen'
import { RebookScreen } from './screens/RebookScreen'
import { RefundConfirmedScreen } from './screens/RefundConfirmedScreen'
import { RefundScreen } from './screens/RefundScreen'

// Vite's BASE_URL carries a trailing slash; React Router wants the bare prefix.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

export const routes = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorScreen />,
    children: [
      { index: true, element: <HomeScreen /> },
      {
        path: 'journey',
        element: <JourneyLayout />,
        children: [
          { index: true, element: <OptionsScreen /> },
          { path: 'rebook', element: <RebookScreen /> },
          { path: 'rebook/confirmed', element: <RebookConfirmedScreen /> },
          { path: 'refund', element: <RefundScreen /> },
          { path: 'refund/confirmed', element: <RefundConfirmedScreen /> },
          { path: 'callback', element: <CallbackScreen /> },
          { path: 'callback/confirmed', element: <CallbackConfirmedScreen /> },
        ],
      },
      { path: '*', element: <NotFoundScreen /> },
    ],
  },
]

export const router = createBrowserRouter(routes, { basename })
