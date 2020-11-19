// MODIFY ONLY in env.php and env-dev.php!
import { env } from 'vc-cake'

if (typeof window.VCV_ENV !== 'undefined') {
  const envs = window.VCV_ENV()
  Object.keys(envs).forEach((key) => {
    env(key, envs[key])
  })
  if (envs.VCV_DEBUG) {
    env('debug', true)
  }
}
