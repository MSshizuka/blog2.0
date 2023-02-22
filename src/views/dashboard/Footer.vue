<template>
  <div class="p-4 pb-1 mt-8 text-center text-white bg-dark-500/90 relative bottom-0 box-border">
    <p class="my-2 z-index-3">
      博客已萌萌哒运行<span class="time-range">{{ longTime }}</span
      ><span class="time-jump">(＾▽＾)o♪</span>
    </p>
    <p>
      托管于
      <a href="https://git.shizuka.icu/ajuna/blog2.0" target="_blank">Gitea</a> .
      <a href="https://www.aliyun.com/" target="_blank">阿里云</a>
      提供静态文件云存储服务.
      <a href="https://tongji.baidu.com/web/welcome/login" target="_blank">百度统计</a>
      提供网站统计服务.
      <a href="https://www.cloudxns.net/Order/index.html" target="_blank">CloudXNS</a>
      提供 DNS 解析服务.
    </p>
    <p>
      © 2021 <a :href="siteUrl">{{ siteName }}</a> 由
      <a href="https://v3.cn.vuejs.org/" target="_blank">Vue3、</a>
      <a href="https://www.antdv.com/components/overview-cn" target="_blank">ant-design-vue、</a>
      <a href="https://vitejs.cn/" target="_blank">vite等技术实现</a>
    </p>
    <p>
      <span>Made with <Icon icon="ant-design:heart-filled" :size="20" color="red" /> by おう</span>
      .
      <a href="https://beian.miit.gov.cn/" target="_blank">苏ICP备20012725号</a>
    </p>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import { Icon } from '/@/components/Icon/index';
  const longTime = ref('');
  const runTime = () => {
    // 运行倒计时
    const oldTime = +new Date('2022/8/03 00:00:00');
    setInterval(() => {
      const nowTime = +new Date();
      const diffTime = nowTime - oldTime;
      const days = parseInt(diffTime / 1000 / 60 / 60 / 24, 10); // 计算剩余的天数
      const hours = parseInt((diffTime / 1000 / 60 / 60) % 24, 10); // 计算剩余的小时
      const minutes = parseInt((diffTime / 1000 / 60) % 60, 10); // 计算剩余的分钟
      const seconds = parseInt((diffTime / 1000) % 60, 10); // 计算剩余的秒数
      longTime.value = days + '天' + hours + '小时' + minutes + '分' + seconds + '秒';
    }, 1000);
  };
  const relationSite = () => {
    return window.location.origin.includes('shizuka.icu')
      ? {
          siteName: 'shizuka.icu (关联bili.icu)',
          siteUrl: 'https://bili.icu',
        }
      : {
          siteName: 'bili.icu (关联shizuka.icu)',
          siteUrl: 'https://shizuka.icu',
        };
  };
  const { siteName, siteUrl } = relationSite();
  runTime();
</script>

<style lang="less" scoped>
  .time-jump {
    animation: dance 5s infinite ease-in-out;
    display: inline-block;
    margin: 0 5px;
  }

  a,
  .time-range {
    color: #0960bd !important;
  }
</style>
