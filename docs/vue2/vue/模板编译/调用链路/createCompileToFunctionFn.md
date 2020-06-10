# 生成render函数

```js {12-19,42,47-52}
/* @flow */

import { noop, extend } from 'shared/util'
import { warn as baseWarn, tip } from 'core/util/debug'
import { generateCodeFrame } from './codeframe'

type CompiledFunctionResult = {
  render: Function;
  staticRenderFns: Array<Function>;
};
// 这里的new Function(code)就是用把模板字符串转换成函数
function createFunction (code, errors) {
  try {
    return new Function(code)
  } catch (err) {
    errors.push({ err, code })
    return noop
  }
}

export function createCompileToFunctionFn (compile: Function): Function {
  const cache = Object.create(null)

  return function compileToFunctions (
    template: string,
    options?: CompilerOptions,
    vm?: Component
  ): CompiledFunctionResult {
    options = extend({}, options)
    const warn = options.warn || baseWarn
    delete options.warn

    // 如果有编译直接用之前的
    const key = options.delimiters
      ? String(options.delimiters) + template
      : template
    if (cache[key]) {
      return cache[key]
    }

    // 调用编译
    const compiled = compile(template, options)

    // turn code into functions
    const res = {}
    const fnGenErrors = []
    // 生成render函数
    res.render = createFunction(compiled.render, fnGenErrors)
    // 生成静态的render函数
    res.staticRenderFns = compiled.staticRenderFns.map(code => {
      return createFunction(code, fnGenErrors)
    })

    // 缓存并返回
    return (cache[key] = res)
  }
}

```

