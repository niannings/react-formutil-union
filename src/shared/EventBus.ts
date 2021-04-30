type Handler<V = any> = (value?: V) => void

interface EventPoolItem {
  queue: Handler[]
  taged: Record<string, Handler>
}

type EventPool = Record<string, EventPoolItem>

class EventBus<T extends string, V extends Partial<Record<T, any>> = any> {
  protected pool: EventPool = {}
  protected oncePool: EventPool = {}

  protected listen(type: 0 | 1, name: T, handler: Handler, tag?: string) {
    const pool = type === 0 ? this.pool : this.oncePool
    let eventer: EventPoolItem = pool[name]

    if (!eventer) {
      eventer = pool[name] = {
        queue: [],
        taged: {}
      }
    }

    if (tag) {
      eventer.taged[tag] = handler
    } else {
      eventer.queue.push(handler)
    }
  }

  public unlisten(name: T, handler: Handler | string) {
    const pools = [this.pool, this.oncePool]

    if (typeof handler === 'string') {
      return pools.reduce((remain, p) => {
        if (name in p) {
          const pool = p[name]

          if (handler in pool.taged) {
            delete pool.taged[handler]
            remain--
          }
        }

        return remain
      }, 2)
    }

    return pools.reduce((remain, p) => {
      if (name in p) {
        const pool = p[name]
        const index = pool.queue.indexOf(handler)

        if (index > -1) {
          pool.queue.splice(index, 1)
          remain += pool.queue.length
        }
      }

      return remain
    }, 0)
  }

  public has(name: T, handler: Handler | string) {
    const pools = [this.pool, this.oncePool]

    if (typeof handler === 'string') {
      return pools.some((p) => name in p && handler in p[name].taged)
    }

    return pools.some((p) => name in p && p[name].queue.includes(handler))
  }

  public on(name: T, handler: Handler, tag?: string) {
    this.listen(0, name, handler, tag)
  }

  public once(name: T, handler: Handler, tag?: string) {
    this.listen(1, name, handler, tag)
  }

  public emit<N extends T>(name: N, value?: V[N]) {
    const pools = [this.pool, this.oncePool]

    pools.forEach((p) => {
      const queue = []

      if (name in p) {
        if (p[name].taged) {
          queue.push(...Object.values(p[name].taged))
        }
        if (p[name].queue) {
          queue.push(...p[name].queue)
        }
      }

      queue.forEach((h) => h(value))
    })

    if (name in this.oncePool) {
      delete this.oncePool[name]
    }
  }
}

export default EventBus

// const bus = new EventBus<'say' | 'eat', { say: { a: number }; eat: string }>()

// bus.on('say', console.log)
// bus.once('eat', console.log)

// bus.emit('say', { a: 3 })
// bus.emit('eat', 'apple')
// bus.emit('eat', 'apple')
