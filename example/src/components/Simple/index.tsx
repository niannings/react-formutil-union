import React, { useMemo } from 'react'
import { Form, FormItem, useForm, withForm } from 'react-antd-formutil'
import { Input, Row, DatePicker } from 'antd'
import Col from 'antd/es/grid/col'
import FormUnion, { useFormUnion } from 'react-formutil-union'
import Layout from '../Layout'

const MyForm = withForm(MyFormContent)

function SimpleContent() {
  const range = useMemo(() => Array(100).fill(0), [])

  return (
    <Row gutter={24}>
      <Col span={12} style={{ background: '#eee' }}>
        <Form>
          {(formutil) => (
            <Layout
              siderLeft={<pre>{JSON.stringify(formutil.$params, null, 2)}</pre>}
            >
              <h2>常规写法</h2>
              <Row gutter={24}>
                {range.map((_, index) => {
                  return (
                    <Col span={4} key={index}>
                      <FormItem label={`输入-${index}`} name={`name_${index}`}>
                        {index % 2 ? <Input size='small' /> : <DatePicker size='small'/>}
                      </FormItem>
                    </Col>
                  )
                })}
              </Row>
            </Layout>
          )}
        </Form>
      </Col>
      <Col span={12}>
        <Layout siderRight={<MyFormDebug />}>
          <h2>使用FormUnion</h2>
          {Array(5)
            .fill(0)
            .map((_, index) => {
              return <MyForm key={index} index={index} />
            })}
        </Layout>
        <MyFormDebug />
      </Col>
    </Row>
  )
}

export default FormUnion.withHOC(SimpleContent, { type: 'object' })

function MyFormDebug() {
  const { watch, getValues } = useFormUnion<object>()
  const params = Object.values(getValues()).reduce((acc, chunk) => Object.assign(acc, chunk), {})

  watch('form_0.name_0')

  return <pre>{JSON.stringify(params, null, 2)}</pre>
}

function MyFormContent({ index }: { index: number }) {
  const range = useMemo(() => Array(20).fill(0), [])
  const formutil = useForm()

  useFormUnion(formutil, `form_${index}`)

  return (
    <Row gutter={24}>
      {range.map((_, i) => {
        const id = i + index * 20

        return (
          <Col span={4} key={i}>
            <FormItem
              label={`输入-${id}`}
              name={`name_${id}`}
            >
              {id % 2 ? <Input size='small' /> : <DatePicker size='small'/>}
            </FormItem>
          </Col>
        )
      })}
    </Row>
  )
}
