import { useEffect, useMemo } from 'react'
// eslint-disable-next-line no-unused-vars
import { $Formutil } from 'react-formutil'
import useUnionContext from './useUnionContext'
import useWatch from './useWatch'

export default function useFormUnion<T>(
  formutil?: $Formutil,
  key?: string | number
) {
  const context = useUnionContext<T>()

  useMemo(() => {
    if (!context.current) {
      throw new Error('useFormUnion 只能在UnionForm组件作用域下使用')
    }
  }, [context])

  useEffect(() => {
    const { core } = context.current!

    if (formutil && key !== undefined) {
      core.collect(key, formutil)
    }

    return () => {
      if (key !== undefined) {
        core.remove(key)
      }
    }
  }, [context, formutil, key])

  return {
    getForms: () => ({ ...context.current!.core.collection }),
    ...context.current!.utils,
    ...useWatch()
  }
}
