![Build status](https://github.com/remvst/animate.js/actions/workflows/check.yaml/badge.svg)

# animate.js

Simple Javascript animation system. Provides timelines and interpolations.

## Example

```typescript
import { Timeline, Animation, InterpolationPool } from '@remvst/animate.js';

const pool = new InterpolationPool();

new Timeline()
    .append(new Animation(myView).interpToOffset('position.x', 100).during(0.3))
    .wait(1)
    .append(new Animation(myView).interpToOffset('position.x', -100).during(0.3))
    .run(pool);


function frame(elapsed: number) {
    pool.cycle(elapsed);
}
```
