import { System } from 'hecs'
import { Foo } from '../components'

export class BarSystem extends System {
  static queries = {
    foos: [Foo],
  }

  update() {
    this.queries.foo.forEach(entity => {
      console.log(`entity ${entity.name} has Foo`)
    })
  }
}
