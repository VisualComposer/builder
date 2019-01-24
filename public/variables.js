// MODIFY ONLY in env.php and env-dev.php!
import { env } from 'vc-cake'

if (typeof window.VCV_ENV !== 'undefined') {
  let envs = window.VCV_ENV()
  Object.keys(envs).forEach((key) => {
    env(key, envs[ key ])
  })
}
