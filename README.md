# react-formutil-union

> 基于react-formutil的高性能表单组件（适用于大型表单）  
> High performance form components based on React - FormUtil (for large forms)

性能对比预览地址：https://niannings.github.io/react-formutil-union/

[![NPM](https://img.shields.io/npm/v/react-formutil-union.svg)](https://www.npmjs.com/package/react-formutil-union) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-formutil-union
```

## Usage

> 关于react-formutil的使用可以查看: https://github.com/qiqiboy/react-formutil

```tsx
import React, { useEffect } from 'react'
import FormUnion, { useFormUnion } from 'react-formutil-union'
import { withForm, useForm, EasyField } from 'react-formutil'

interface FormUnionParams {
  person: {
    name: string
    // ...
  }
  job: {
    name: string
    // ...
  }
}

const Form1 = withForm(() => {
  const formutil = useForm()

  useFormUnion(formutil, 'person')

  return (
    <>
      <EasyField name='name'>
        <input />
      </EasyField>
      {/** 假设有很多表单项 */}
    </>
  )
})

const Form2 = withForm(() => {
  const formutil = useForm()
  // 使用watch实现表单间通信
  const { watch, getValues } = useFormUnion<FormUnionParams>(formutil, 'job')

  watch('person.name')

  return (
    <>
      {getValues().person?.name && (
        <EasyField name='name'>
          <input />
        </EasyField>
      )}
      {/** 假设有很多表单项 */}
    </>
  )
})

function App() {
  const {
    // 获取表单值
    getValues,
    // 获取当前校验状态
    getValidStatus,
    // 触发所有错误提示
    batchDirty,
    // 获取第一个错误
    getFirstError,
    // 获取表单默认值
    getUnionDefaultValues
  } = useFormUnion<FormUnionParams>()

  const submit = async () => {
    if (!getValidStatus()) {
      console.log(getFirstError())
      batchDirty(true)

      return
    }

    try {
      await fetch('/api', {
        method: 'post',
        body: JSON.stringify(getValues())
      })
    } catch (error) {
      // console.log(error)
    }
  }

  useEffect(() => {
    console.log(getUnionDefaultValues())
  }, [getUnionDefaultValues])

  return (
    <div>
      <Form1 />
      <Form2 />
      {/** <Form3 />... */}
      <button onClick={submit}>提交</button>
    </div>
  )
}

export default FormUnion.withHOC<object, FormUnionParams>(App, {
  type: 'object',
  defaultValues: {
    person: {
      name: 'niannings'
    },
    job: {
      name: 'fe'
    }
  }
})
```

## License

MIT © [niannings](https://github.com/niannings)
