import React, { useMemo, useState } from 'react'
import { Form, FormItem, useForm, withForm } from 'react-antd-formutil'
import { Input, Row, DatePicker, Button } from 'antd'
import Col from 'antd/es/grid/col'
import FormUnion, { useFormUnion } from 'react-formutil-union'
import Layout from '../Layout'
import FPSViewer from '../FPSViewer'

const MyForm = withForm(MyFormContent)

function SimpleContent() {
  const [total, setTotal] = useState(200)
  const [showParams, setShowParams] = useState(false)
  const range = useMemo(() => Array(total).fill(0), [total])

  return (
    <Row gutter={24}>
      <Col span={11}>
        <Form>
          {(formutil) => (
            <Layout
              siderLeft={
                <span>
                  {showParams && (
                    <pre>{JSON.stringify(formutil.$params, null, 2)}</pre>
                  )}
                </span>
              }
            >
              <h2>常规写法</h2>
              <Row gutter={24}>
                {range.map((_, index) => {
                  return (
                    <Col span={6} key={index}>
                      <FormItem label={`输入-${index}`} name={`name_${index}`}>
                        {index % 2 ? (
                          <Input size='small' />
                        ) : (
                          <DatePicker size='small' />
                        )}
                      </FormItem>
                    </Col>
                  )
                })}
              </Row>
            </Layout>
          )}
        </Form>
      </Col>
      <Col span={2} style={{ background: '#eee', textAlign: 'center' }}>
        <FPSViewer />
        <p style={{ fontSize: 12, color: 'gray' }}>分别在两边表单输入并观察FPS变化</p>
        <Button
          type='primary'
          size='small'
          onClick={() => setShowParams((v) => !v)}
        >
          {showParams ? '隐藏' : '显示'}表单状态
        </Button>
        <i style={{ fontSize: 12, color: 'gray' }}>
          当前表单项数量 (表单项应大于20且能被20整除)：{total}
        </i>
        <Input
          size='small'
          placeholder="表单项数"
          onChange={(e) => {
            const value = +e.target.value
            value && value % 20 === 0 && setTotal(value)
          }}
        />
      </Col>
      <Col span={11}>
        <Layout siderRight={<span>{showParams && <MyFormDebug />}</span>}>
          <h2>使用FormUnion</h2>
          {Array(total / 20)
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
  const params = Object.values(getValues()).reduce(
    (acc, chunk) => Object.assign(acc, chunk),
    {}
  )

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
          <Col span={6} key={i}>
            <FormItem label={`输入-${id}`} name={`name_${id}`}>
              {id % 2 ? <Input size='small' /> : <DatePicker size='small' />}
            </FormItem>
          </Col>
        )
      })}
    </Row>
  )
}
