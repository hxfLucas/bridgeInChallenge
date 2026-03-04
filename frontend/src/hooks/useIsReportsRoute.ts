import { useMatch } from 'react-router-dom'

export default function useIsReportsRoute(): boolean {
  return Boolean(
    useMatch({ path: '/acp/reports', end: true }) ||
      useMatch({ path: '/reports', end: true })
  )
}
