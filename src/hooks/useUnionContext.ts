import { RefObject, useContext } from 'react'
import { UnionUtils } from '../index'
import UnionContext from '../context/UnionContext'

export default function useUnionContext<T>() {
  const getContext = useContext(UnionContext)

  return getContext() as RefObject<UnionUtils<T>>
}
