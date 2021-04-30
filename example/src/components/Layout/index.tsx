import React, { ReactNode } from 'react'
import './style.css'

interface LayoutProps {
  children: ReactNode
  siderLeft?: ReactNode
  siderRight?: ReactNode
}

export default function Layout({
  children,
  siderLeft,
  siderRight
}: LayoutProps) {
  return (
    <div className='layout'>
      {siderLeft && <div className='sider'>{siderLeft}</div>}
      <div className='content'>{children}</div>
      {siderRight && <div className='sider'>{siderRight}</div>}
    </div>
  )
}
