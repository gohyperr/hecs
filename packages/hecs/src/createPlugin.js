export function createPlugin({
  name,
  plugins = [],
  systems = [],
  components = [],
  decorate = () => {},
}) {
  if (!name) throw new Error('hecs: createPlugin requires name')
  return {
    name,
    plugins,
    systems,
    components,
    decorate,
  }
}
