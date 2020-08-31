import { LayerManager } from './LayerManager'
import { FixedJointBroke } from './components'

let version
let allocator
let defaultErrorCallback
let foundation

export class Physics {
  constructor(world) {
    this.world = world
    this.setup()
    this.version = version
    this.allocator = allocator
    this.defaultErrorCallback = defaultErrorCallback
    this.foundation = foundation
    const tolerances = new PhysX.PxTolerancesScale()
    const physxSimulationCallbackInstance = PhysX.PxSimulationEventCallback.implement(
      {
        onConstraintBreak: (actor0, actor1) => {
          const entityId = this.entityIdByActor.get(actor0.$$.ptr)
          const entity = world.entities.getById(entityId)
          entity.add(FixedJointBroke)
        },
        onContactBegin: () => {},
        onContactEnd: () => {},
        onContactPersist: () => {},
        onTriggerBegin: () => {},
        onTriggerEnd: () => {},
      }
    )
    this.physics = PhysX.PxCreatePhysics(
      version,
      foundation,
      tolerances,
      false,
      null
    )
    PhysX.PxInitExtensions(this.physics, null)
    const sceneDesc = PhysX.getDefaultSceneDesc(
      tolerances,
      0,
      physxSimulationCallbackInstance
    )
    this.scene = this.physics.createScene(sceneDesc)
    this.entityIdByActor = new Map()

    // layer groups and masks
    this.layers = new LayerManager()

    this.controllerManager = PhysX.PxCreateControllerManager(this.scene, null)

    // By default all query filters (sweep, raycast etc) will hit all shapes
    // Override this function to implement your own
    this.queryPreFilterFn = function (filterData, shape, actor) {
      // Example for a miss:
      // Layer.value is the bit for that layer
      // shapeFilterData.word1 contains the mask of the Collider layer
      // let shapeFilterData = shape.getQueryFilterData()
      // if (!(this.layers.get(4).value & shapeFilterData.word1)) {
      //   return PhysX.PxQueryHitType.eNONE
      // }
      return PhysX.PxQueryHitType.eTOUCH
    }

    const controllerQueryCallback = PhysX.PxQueryFilterCallback.implement({
      postFilter: (filterData, hit) => {
        // @todo this isnt being called (?) and requires thought to determine
        // what it should return if it is
        console.warn('TODO: Not expecting this postFilter call')
        return PhysX.PxQueryHitType.eTOUCH
      },
      preFilter: (filterData, shape, actor) => {
        return this.queryPreFilterFn(filterData, shape, actor)
      },
    })

    this.controllerFilters = new PhysX.PxControllerFilters(
      null,
      controllerQueryCallback,
      null
    )

    const cookingParams = new PhysX.PxCookingParams(tolerances)
    this.cooking = PhysX.PxCreateCooking(version, foundation, cookingParams)
    cookingParams.delete()
  }

  setup() {
    // these values must be created once globally to be
    // used across all Physics instances
    if (!foundation) {
      version = PhysX.PX_PHYSICS_VERSION
      allocator = new PhysX.PxDefaultAllocator()
      defaultErrorCallback = new PhysX.PxDefaultErrorCallback()
      foundation = PhysX.PxCreateFoundation(
        version,
        allocator,
        defaultErrorCallback
      )
    }
  }

  setPassive(passive) {
    this.world.systems.getByName('CharacterControllerSystem').active = !passive
    this.world.systems.getByName('ColliderSystem').active = !passive
    this.world.systems.getByName('FixedJointSystem').active = !passive
    this.world.systems.getByName('PhysicsSystem').active = !passive
    this.world.systems.getByName('RigidBodySystem').active = !passive
  }
}
