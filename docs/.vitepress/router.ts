// ref. [kwhitley/itty-router: A little router.](https://github.com/kwhitley/itty-router)

export class Router {
  private routes: {
    match: (path: string) => boolean
    handler: () => void
  }[] = []

  add(pattern: string, handler: () => void) {
    this.routes.push({
      match: (path: string) => !!path.match(
        new RegExp(`^${pattern
          .replace(/(\/?)\*/g, '($1.*)?') // wildcard
        }$`),
      ),
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
