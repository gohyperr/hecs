import { LayerManager } from './LayerManager'

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
    const triggerCallback = {
      onContactBegin: () => {},
      onContactEnd: () => {},
      onContactPersist: () => {},
      onTriggerBegin: () => {},
      onTriggerEnd: () => {},
    }
    const physxSimulationCallbackInstance = PhysX.PxSimulationEventCallback.implement(
      triggerCallback
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

    // layer groups and masks
    const layers = new LayerManager()
    layers.create('Default')
    layers.create('PlayerController')
    layers.create('PlayerAttached')
    layers.setCollision(layers.PlayerController, layers.PlayerAttached, false)
    this.layers = layers

    this.controllerManager = PhysX.PxCreateControllerManager(this.scene, null)

    const controllerQueryCallback = PhysX.PxQueryFilterCallback.implement({
      postFilter: (filterData, hit) => {
        console.warn('Not expecting this postFilter call')
        return PhysX.PxQueryHitType.eTOUCH
      },
      preFilter: (filterData, shape, actor) => {
        let shapeFilterData = shape.getQueryFilterData()
        if (!(this.layers.PlayerController.value & shapeFilterData.word1)) {
          return PhysX.PxQueryHitType.eNONE
        }
        return PhysX.PxQueryHitType.eTOUCH
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
    this.world.systems.getByName('ColliderSystem').active = !passive
    this.world.systems.getByName('PhysicsSystem').active = !passive
    this.world.systems.getByName('RigidBodySystem').active = !passive
  }
}
