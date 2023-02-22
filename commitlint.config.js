module.exports = {
  /*
   *  提交格式  git commit -m "<type>(<scope>): subject \r\n<body> \r\n<footer>"
   *     scope、body、footer可以省略
   *     0:禁用规则
   *     1:报警告
   *     2:报错
   *     always: 描述正执行
   *     never: 描述反执行
   */

  ignores: [(commit) => commit.includes('init')],
  extends: ['@commitlint/config-conventional'],
  rules: {
    'body-leading-blank': [2, 'always'], // body上要有换行
    'footer-leading-blank': [1, 'always'], // footer上面要有换行
    'header-max-length': [2, 'always', 108], // header最大108字符
    'subject-empty': [2, 'never'], // subject位不能为null
    'type-empty': [2, 'never'], // type位不能为null
    'subject-case': [0], // 禁用描述规则
    'type-enum': [
      // type类型规则
      2,
      'always',
      [
        'feat', // 新增功能
        'fix', //bug 修复
        'perf', //性能优化
        'style', //不影响程序逻辑的代码修改 分号 空格等
        'docs', // 文档更新
        'test', // 测试用例
        'refactor', // 重构
        'build', //修改项目构建配置文件
        'ci', //持续集成流程
        'chore', // 日常事务
        'revert', // 回滚版本
        'wip', // 制作中
        'workflow', // 流程修改
        'types', // 类型修改
        'release', // 发布相关
      ],
    ],
  },
};
