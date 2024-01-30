import { createBrowserRouter } from 'react-router-dom'
import List from '@/pages/List'
import Detail from '@/pages/Detail'

const router = createBrowserRouter([
  {
    path: '/',
    element: <List />,
  },
  {
    path: '/detail',
    element: <Detail />,
  },
])

export default router