export function createFixedTimestep(timestep, fixed, norm) {
  let accumulator = 0
  return (delta = 0, frame) => {
    if (norm) norm(delta, frame)
    accumulator += delta
    while (accumulator >= timestep) {
      fixed(accumulator, frame)
      accumulator -= timestep
    }
  }
}
