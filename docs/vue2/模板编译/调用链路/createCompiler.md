# 传入编译器

```js {6,9,12}
export const createCompiler = createCompilerCreator(function baseCompile (
  template: string,
  options: CompilerOptions
): CompiledResult {
  // 生成dom的抽象语法树
  const ast = parse(template.trim(), options)
  // 优化dom diff, 一些静态的html就不会再去dom diff
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  // 生成字符串的render函数
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```

