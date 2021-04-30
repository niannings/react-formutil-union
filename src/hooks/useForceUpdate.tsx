import { useCallback, useState } from 'react'

export default function useForceUpdate() {
  const [, setFlag] = useState(0)

  return useCallback(() => setFlag((flag) => flag + 1), [])
}
