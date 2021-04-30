import { useCallback, useEffect, useMemo, useRef } from 'react'
import useUnionContext from './useUnionContext'
import useForceUpdate from './useForceUpdate'
import { get, uniqueId } from '../utils'

function diffObj(a: object, b: object) {
  return Object.keys(a).filter((k) => a[k] !== b[k])
}

export default function useWatch() {
  const context = useUnionContext()

  useMemo(() => {
    if (!context.current) {
      throw new Error('useFormUnion 只能在UnionForm组件作用域下使用')
    }
  }, [context])

  const watchListRef = useRef<Set<string>>()
  const idRef = useRef<string>()
  const oldDepValuesRef = useRef<object>()
  const update = useForceUpdate()

  useMemo(() => {
    watchListRef.current = new Set()
    idRef.current = uniqueId('w_')
  }, [])

  const watch = useCallback(
    (name: string | string[]) => {
      const { core } = context.current!

      const w = (name: string) => {
        watchListRef.current?.add(name)
        core.deps.add(name)
        core.eventBus.on(name, update, idRef.current)
      }

      typeof name === 'string' ? w(name) : name.forEach(w)
    },
    [context, update]
  )

  const noWatch = useCallback(
    (name: string | string[]) => {
      const { core } = context.current!

      const w = (name: string) => {
        if (core.eventBus.unlisten(name, idRef.current as string) === 0) {
          core.deps.delete(name)
        }
      }

      typeof name === 'string' ? w(name) : name.forEach(w)
    },
    [context]
  )

  useEffect(() => {
    const { core, utils } = context.current!

    if (core.deps.size > 0) {
      const { eventBus } = core
      const store = utils.getValues()
      const depValues = {}

      for (const k of core.deps) {
        depValues[k] = get(store, k)
      }

      diffObj(depValues, oldDepValuesRef.current || {}).forEach((k) => {
        if (!eventBus.has(k, idRef.current!)) {
          eventBus.emit(k)
        }
      })

      oldDepValuesRef.current = depValues
    }
  })

  useEffect(() => {
    return () => {
      for (const w of watchListRef.current!) {
        noWatch(w)
      }
    }
  }, [noWatch])

  return {
    watch,
    noWatch
  }
}
