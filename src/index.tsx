import React, {
  ComponentType,
  createElement,
  PropsWithChildren,
  useCallback,
  useMemo,
  useRef
} from 'react'
import { $Formutil } from 'react-formutil'
import { set, uniq } from './utils'
import UnionContext from './context/UnionContext'
import EventBus from './shared/EventBus'

type Model = 'array' | 'object'

export { default as useFormUnion } from './hooks/useFormUnion'

export interface UnionUtils<T> {
  core: {
    collection: Record<string, $Formutil>
    collect: (key: string | number, formutil: $Formutil) => $Formutil
    remove: (key: string | number) => boolean
    type: Model
    deps: Set<string>
    eventBus: EventBus<string, T>
    defaultValues?: T
    keys?: string[]
  }
  utils: {
    getValues: () => T
    getValidStatus: () => boolean
    batchDirty: (dirty: boolean) => void
    getFirstError: () => string | undefined
    getUnionDefaultValues: () => T | undefined
  }
}

export interface FormUnionProps<T> {
  type: Model
  defaultValues?: T
  keys?: string[] // 当type === object时如果需要保证表单取值或取error的顺序
}

export default function FormUnion<T>({
  children,
  defaultValues,
  type,
  keys
}: PropsWithChildren<FormUnionProps<T>>) {
  const ref = useRef<UnionUtils<T>>()

  useMemo(() => {
    if (ref.current) {
      ref.current.core.type = type
      ref.current.core.defaultValues = defaultValues
      ref.current.core.keys = keys
    } else {
      const collection: Record<string | number, $Formutil> = {}
      const collect = (key: string | number, formutil: $Formutil) =>
        (collection[key] = formutil)
      const remove = (key: string | number) => delete collection[key]
      const getValues = () => {
        let res = {} as T

        if (type === 'array') {
          res = [] as any
        }

        if (type === 'object') {
          return Object.entries(collection).reduce((value, [k, v]) => {
            set(value as any, k, v.$params)

            return value
          }, res)
        }

        return Object.entries(collection).reduce((value, [k, v]) => {
          value[k] = v.$params

          return value
        }, res)
      }
      const getValidStatus = () => {
        return Object.values(collection).every((util) => util.$valid)
      }
      const batchDirty = (dirty: boolean) => {
        return Object.values(collection).forEach((util) =>
          util.$batchDirty(dirty)
        )
      }
      const getFirstError = () => {
        let error: string | undefined
        const sortedKeys = Array.isArray(keys)
          ? uniq([...keys, ...Object.keys(collection)])
          : Object.keys(collection)

        sortedKeys.some((key: string) => {
          const util = collection[key]

          if (
            util &&
            util.$invalid &&
            typeof util.$getFirstError === 'function'
          ) {
            error = util.$getFirstError()
          }

          return util?.$invalid
        })

        return error
      }
      const getUnionDefaultValues = () =>
        ({ ...ref.current?.core.defaultValues } as T | undefined)

      ref.current = {
        core: {
          collection,
          collect,
          remove,
          deps: new Set(),
          eventBus: new EventBus(),
          type,
          defaultValues,
          keys
        },
        utils: {
          getValues,
          getValidStatus,
          batchDirty,
          getFirstError,
          getUnionDefaultValues
        }
      }
    }
  }, [defaultValues, keys, type])

  const getContext = useCallback(() => ref, [])

  return (
    <UnionContext.Provider value={getContext}>{children}</UnionContext.Provider>
  )
}

type UnionProps<T> = Partial<Omit<FormUnionProps<T>, 'children'>>

FormUnion.withHOC = function withFormUnion<P, T>(
  Comp: ComponentType<P>,
  options: UnionProps<T>
) {
  const HOCWithFormUnion: React.FC<UnionProps<T> & P> = (props) => {
    const { type, defaultValues, ...rest } = { ...options, ...props }

    return (
      <FormUnion type={type || 'object'} defaultValues={defaultValues}>
        {createElement(Comp, rest as P)}
      </FormUnion>
    )
  }

  HOCWithFormUnion.displayName = `FormUnion.${
    Comp.displayName || Comp.name || 'Anonymous'
  }`

  return HOCWithFormUnion
}
