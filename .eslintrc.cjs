/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier',
    '.eslintrc-auto-imports.json'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-empty': ['error', { allowEmptyCatch: true }], // 不允许空块语句，但允许空catch子句
    'no-shadow': ['error', { allow: ['state'] }], // 校验阴影变量声明，但允许store中的state
    'global-require': 'off', // 允许require的调用不用必须位于模块顶层
    'arrow-body-style': ['error', 'as-needed'], // 禁止在箭头函数体的周围使用大括号
    'linebreak-style': ['error', 'unix'], // 统一行结尾
    'no-param-reassign': 'off', // 允许对函数参数进行再赋值
    'import/no-cycle': 'off',
    'import/no-unresolved': 'off', // 取消自动解析路径，以此开启alias的别名路径设置
    'import/no-extraneous-dependencies': 'off', // 使用history/createBrowserHistory引入包时，不会报错
    'import/extensions': 'off', // 取消对文件扩展名的验证
    'vue/html-self-closing': [
      'error', // 强制标签自闭合
      {
        html: {
          void: 'always',
          normal: 'always',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ],
    curly: ['error', 'multi-line'], // 禁止多行条件省略花括号
    'no-redeclare': 'off', // 禁用原有重复声明规则，以支持ts函数重载
    '@typescript-eslint/no-redeclare': 'error', // 启用ts重复声明规则，以支持ts函数重载
    'vue/multi-word-component-names': 'off',
    'vue/valid-v-slot': 'off',
    'no-console': ['warn', { allow: ['error'] }],
    'no-debugger': 'warn',
    '@typescript-eslint/consistent-type-imports': 'error'
  }
}
