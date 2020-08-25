const editJsonFile = require('edit-json-file')
const path = require('path')

const package = editJsonFile(path.resolve(__dirname, '../package.json'), {
  stringify_eol: true,
})
const version = package.get('version')
package.set('peerDependencies.hecs', `^${version}`)
package.set('peerDependencies.hecs-plugin-core', `^${version}`)
package.save()
