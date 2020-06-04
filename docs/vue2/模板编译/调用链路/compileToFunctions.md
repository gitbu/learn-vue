#  传入baseOptions

```js {6}
/* @flow */

import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'
// 这个只干了一件事儿，传入baseOptions
const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }

```