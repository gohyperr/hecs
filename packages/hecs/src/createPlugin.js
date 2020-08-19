export function createPlugin({
  name,
  plugins = [],
  systems = [],
  components = [],
  providers = {},
}) {
  if (!name) throw new Error('ECS: createPlugin requires name')
  return {
    name,
    plugins,
    systems,
    components,
    providers,
  }
}
