import { minimatch } from 'minimatch'

export class Router {
  private routes: {
    match: (path: string) => boolean
    handler: () => void
  }[] = []

  add(pattern: string, handler: () => void) {
    this.routes.push({
      match: (path: string) => minimatch(path, pattern),
      handler,
    })
    return this
  }

  handle(path: string) {
    for (const route of this.routes) {
      if (route.match(path)) {
        route.handler()
        return
      }
    }
  }
}
