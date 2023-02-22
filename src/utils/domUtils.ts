// import type { FunctionArgs } from '@vueuse/core';
// import { upperFirst } from 'lodash-es';
import sakura01 from '/@/assets/images/sakura01.png';
import sakura02 from '/@/assets/images/sakura02.png';

export interface ViewportOffsetResult {
  left: number;
  top: number;
  right: number;
  bottom: number;
  rightIncludeBody: number;
  bottomIncludeBody: number;
}

export function getBoundingClientRect(element: Element): DOMRect | number {
  if (!element || !element.getBoundingClientRect) {
    return 0;
  }
  return element.getBoundingClientRect();
}

function trim(string: string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+ctx/g, '');
}

/* istanbul ignore next */
export function hasClass(el: Element, cls: string) {
  if (!el || !cls) return false;
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.');
  if (el.classList) {
    return el.classList.contains(cls);
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }
}

/* istanbul ignore next */
export function addClass(el: Element, cls: string) {
  if (!el) return;
  let curClass = el.className;
  const classes = (cls || '').split(' ');

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.add(clsName);
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName;
    }
  }
  if (!el.classList) {
    el.className = curClass;
  }
}

/* istanbul ignore next */
export function removeClass(el: Element, cls: string) {
  if (!el || !cls) return;
  const classes = cls.split(' ');
  let curClass = ' ' + el.className + ' ';

  for (let i = 0, j = classes.length; i < j; i++) {
    const clsName = classes[i];
    if (!clsName) continue;

    if (el.classList) {
      el.classList.remove(clsName);
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ');
    }
  }
  if (!el.classList) {
    el.className = trim(curClass);
  }
}
/**
 * Get the left and top offset of the current element
 * left: the distance between the leftmost element and the left side of the document
 * top: the distance from the top of the element to the top of the document
 * right: the distance from the far right of the element to the right of the document
 * bottom: the distance from the bottom of the element to the bottom of the document
 * rightIncludeBody: the distance between the leftmost element and the right side of the document
 * bottomIncludeBody: the distance from the bottom of the element to the bottom of the document
 *
 * @description:
 */
export function getViewportOffset(element: Element): ViewportOffsetResult {
  const doc = document.documentElement;

  const docScrollLeft = doc.scrollLeft;
  const docScrollTop = doc.scrollTop;
  const docClientLeft = doc.clientLeft;
  const docClientTop = doc.clientTop;

  const pageXOffset = window.pageXOffset;
  const pageYOffset = window.pageYOffset;

  const box = getBoundingClientRect(element);

  const { left: retLeft, top: rectTop, width: rectWidth, height: rectHeight } = box as DOMRect;

  const scrollLeft = (pageXOffset || docScrollLeft) - (docClientLeft || 0);
  const scrollTop = (pageYOffset || docScrollTop) - (docClientTop || 0);
  const offsetLeft = retLeft + pageXOffset;
  const offsetTop = rectTop + pageYOffset;

  const left = offsetLeft - scrollLeft;
  const top = offsetTop - scrollTop;

  const clientWidth = window.document.documentElement.clientWidth;
  const clientHeight = window.document.documentElement.clientHeight;
  return {
    left: left,
    top: top,
    right: clientWidth - rectWidth - left,
    bottom: clientHeight - rectHeight - top,
    rightIncludeBody: clientWidth - left,
    bottomIncludeBody: clientHeight - top,
  };
}

// export function hackCss(attr: string, value: string) {
//   const prefix: string[] = ['webkit', 'Moz', 'ms', 'OT'];

//   const styleObj: any = {};
//   prefix.forEach((item) => {
//     styleObj[`ctx{item}ctx{upperFirst(attr)}`] = value;
//   });
//   return {
//     ...styleObj,
//     [attr]: value,
//   };
// }

/* istanbul ignore next */
export function on(
  element: Element | HTMLElement | Document | Window,
  event: string,
  handler: EventListenerOrEventListenerObject,
): void {
  if (element && event && handler) {
    element.addEventListener(event, handler, false);
  }
}

// /* istanbul ignore next */
export function off(
  element: Element | HTMLElement | Document | Window,
  event: string,
  handler: Fn,
): void {
  if (element && event && handler) {
    element.removeEventListener(event, handler, false);
  }
}

// /* istanbul ignore next */
export function once(el: HTMLElement, event: string, fn: EventListener): void {
  const listener = function (this: any, ...args: unknown[]) {
    if (fn) {
      fn.apply(this, args);
    }
    off(el, event, listener);
  };
  on(el, event, listener);
}

// export function useRafThrottle<T extends FunctionArgs>(fn: T): T {
//   let locked = false;
//   // @ts-ignore
//   return function (...args: any[]) {
//     if (locked) return;
//     locked = true;
//     window.requestAnimationFrame(() => {
//       // @ts-ignore
//       fn.apply(this, args);
//       locked = false;
//     });
//   };
// }

interface Line {
  speed: number;
  die: boolean;
  posx: number;
  posy: number;
  h: number;
  color: string;
}

interface Drop {
  die: boolean;
  posx: number;
  posy: number;
  vx: number;
  vy: number;
  radius: number;
}

export function useRain(selector: string) {
  const contentBox = document.querySelector(selector);
  if (!contentBox) return;
  let boxWidth = contentBox.clientWidth - 10;
  let boxHeight = contentBox.scrollHeight;

  const createCanvas = () => {
    // 获取canvas元素
    const canvas = document.createElement('canvas');
    canvas.width = boxWidth - 10;
    canvas.height = boxHeight;
    canvas.style.position = `fixed`;
    canvas.style.top = '0';
    canvas.style['z-index'] = 99999;
    canvas.style['pointer-events'] = 'none';
    contentBox.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    // // canvas画布的 背景颜色
    const backgroundColor = 'transparent';
    // // canvas画布的宽 等于 可视区域的宽
    // canvas.width = canvas.clientWidth;
    // // canvas画布的高 等于 可视区域的高
    // canvas.height = canvas.clientHeight;
    // 保存小水珠的数组
    // 雨滴下落后散成小水珠，小水珠就是一些圆弧
    const dropList: Drop[] = [];
    // 重力
    // 雨滴下落后散成小水珠，小水珠会先上升后下降，主要是因为 gravity 这个变量的缘故
    const gravity = 0.5;
    // 保存雨滴的数组
    // 每个雨滴 都是 画的一条线
    const lineList: Line[] = [];
    // 保存鼠标的坐标
    // mousePos[0] 代表x轴的值，mousePos[1] 代表y轴的值
    const mousePos = [0, 0];
    // 跟随鼠标， mouseDis 大小区域内的雨滴会消失，形成散落效果
    // 以mousePos为圆心，mouseDis为半径，这个范围内的雨滴 都会散开，形成许多小水珠
    const mouseDis = 35;
    // 更新一次动画，画lineNum 条雨滴，lineNum 值越大，下雨就越密集
    const lineNum = 1;
    // 跟随鼠标方向 变化下雨方向的 速度
    // 鼠标移动后，下雨的方向 会慢慢改变，主要靠speedx 这个变量
    let speedx = 0;
    // maxspeedx 为 speedx 可以取的最大值
    // 当 speedx = maxspeedx时，下雨方向 会 随鼠标移动方向立即改变
    let maxspeedx = 0;
    //移动鼠标触发事件
    window.onmousemove = function (e) {
      //  设置mousePos 等于 鼠标坐标
      //  e.clientX 为距离 浏览器窗口可视区域 左边的距离
      //  e.clientY 为距离 浏览器窗口可视区域 上边的距离
      mousePos[0] = e.clientX;
      mousePos[1] = e.clientY;
      // 通过鼠标位置，设置 maxspeedx的值，取值范围是 -1 到 1
      // maxspeedx的值，关系到
      // 1、雨滴的方向
      // 2、雨滴下落的方向
      // 3、雨滴下落方向 跟随 鼠标移动方向变化的速度
      // 4、小水珠的移动方向
      // 值越接近1，表示方向越向右
      // 值越接近-1，表示方向越向左
      maxspeedx = (e.clientX - canvas.clientWidth / 2) / (canvas.clientWidth / 2);
    };
    // 根据参数，返回一个rgb颜色，用于给雨滴设置颜色
    function getRgb(r, g, b) {
      return 'rgb(' + r + ',' + g + ',' + b + ')';
    }
    // 画 一滴雨（一条线）
    function createLine(e) {
      // 随机生成 雨滴的长度
      const temp = 0.25 * (50 + Math.random() * 100);
      // 一个 line 对象，代表一个雨滴
      const line: Line = {
        // 雨滴下落速度
        speed: 5.5 * (Math.random() * 6 + 3),
        // 判断是否删除，值为true就删除
        die: false,
        // 雨滴x坐标
        posx: e,
        // 雨滴y坐标
        posy: -50,
        // 雨滴的长度
        h: temp,
        // 雨滴的颜色
        color: getRgb(
          Math.floor((temp * 255) / 75),
          Math.floor((temp * 255) / 75),
          Math.floor((temp * 255) / 75),
        ),
      };
      // 把创建好的line（雨滴）对象，添加到保存雨滴的数组
      lineList.push(line);
    }
    // 画一个小水珠（雨滴散开后的小水珠就是一个个的圆弧）
    function createDrop(x, y) {
      // 一个 drop 对象，代表一个圆弧
      const drop = {
        // 判断是否删除，值为true就删除
        die: false,
        // 圆弧圆心的x坐标
        posx: x,
        // 圆弧圆心的y坐标
        posy: y,
        // vx 表示 x轴的值 变化的速度
        vx: (Math.random() - 0.5) * 8,
        // vy 表示 y轴的值 变化的速度 取值范围：-3 到 -9
        vy: Math.random() * -6 - 3,
        // 圆弧的半径
        radius: Math.random() * 1.5 + 1,
      };
      return drop;
    }
    // 画一定数量的小水珠
    function madedrops(x, y) {
      // 随机生成一个数 maxi
      // maxi 代表要画小水珠的数量
      const maxi = Math.floor(Math.random() * 5 + 5);
      for (let i = 0; i < maxi; i++) {
        dropList.push(createDrop(x, y));
      }
    }
    // 更新动画
    function update() {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
      // 如果保存小水珠的数组有内容
      if (dropList.length > 0) {
        // 遍历保存小水珠的数组
        dropList.forEach(function (e) {
          //设置e.vx，vx表示x坐标变化的速度
          // (speedx)/2 是为了，让小水珠 在x轴的移动距离短一点，看上去更真实点
          // 也使 小水珠的移动方向 和 雨滴方向，雨滴下落方向，鼠标移动方向相同
          e.vx = e.vx + speedx / 2;
          e.posx = e.posx + e.vx;
          //设置e.vy，vy表示y坐标变化的速度
          // e.vy的范围是-3 到 -9，而这时e.posy（y坐标）一定是正值，所以 e.posy的值会先减小后增大
          // 也就是实现 雨滴散成小水珠，小水珠会先上升后下降的效果
          e.vy = e.vy + gravity;
          e.posy = e.posy + e.vy;
          // 如果 小水珠y坐标 大于 可视区域的高度，设置die属性为true
          // 小水珠如果超出可视区域就删除掉
          if (e.posy > canvas.clientHeight) {
            e.die = true;
          }
        });
      }
      // 删除 die属性为ture 的数组成员
      // 可视区域外的小水珠删除掉
      for (let i = dropList.length - 1; i >= 0; i--) {
        if (dropList[i].die) {
          dropList.splice(i, 1);
        }
      }
      // 设置下雨方向变换的速度，取值范围： -1 到 1
      // 当 speedx = maxspeedx时，下雨方向 会 随鼠标移动方向立即改变
      speedx = speedx + (maxspeedx - speedx) / 50;
      // 根据lineNum的值，画一定数量雨滴
      for (let i = 0; i < lineNum; i++) {
        // 调用createLine 函数，参数是雨滴x坐标
        createLine(Math.random() * 2 * canvas.width - 0.5 * canvas.width);
      }
      // 设置结束线，也就是雨滴散开 形成许多小水珠的位置
      const endLine = canvas.clientHeight - (Math.random() * canvas.clientHeight) / 5;
      // 遍历保存雨滴的数组
      lineList.forEach(function (e) {
        // 利用勾股定理 确定一个范围，在这个范围内雨滴会散开形成小水珠
        // e.posx + speedx * e.h 是雨滴x坐标
        // e.posy + e.h 是雨滴y坐标
        const dis = Math.sqrt(
          (e.posx + speedx * e.h - mousePos[0]) * (e.posx + speedx * e.h - mousePos[0]) +
            (e.posy + e.h - mousePos[1]) * (e.posy + e.h - mousePos[1]),
        );
        // 如果在mouseDis区域内，就删除雨滴，画一些小水珠（圆弧）
        // 实现鼠标碰到雨滴，雨滴散成小水珠的效果
        if (dis < mouseDis) {
          // 删除 雨滴
          e.die = true;
          // 画一些小水珠（圆弧）
          madedrops(e.posx + speedx * e.h, e.posy + e.h);
        }
        // 如果雨滴超过 结束线，删除雨滴，画一些小水珠（圆弧）
        if (e.posy + e.h > endLine) {
          e.die = true;
          madedrops(e.posx + speedx * e.h, e.posy + e.h);
        }
        // 如果 雨滴 y坐标 大于 可视区域的高度，设置die属性为true
        // 如果 雨滴 超出可视区域就删除掉
        if (e.posy >= canvas.clientHeight) {
          e.die = true;
        } else {
          // 逐渐增加 雨滴 y坐标的值
          e.posy = e.posy + e.speed;
          // 变化雨滴 x坐标
          // * speedx 用来控制雨滴 下落 方向
          // 使 雨滴下落方向 和 鼠标移动方向相同
          e.posx = e.posx + e.speed * speedx;
        }
      });
      // 删除 die属性为ture 的数组成员
      // 鼠标区域内的，超过结束线的，可视区域外的雨滴删除掉
      for (let i = lineList.length - 1; i >= 0; i--) {
        if (lineList[i].die) {
          lineList.splice(i, 1);
        }
      }
      // 渲染
      render();
      // 递归调用 update，实现动画效果
      window.requestAnimationFrame(update);
    }
    // 渲染
    function render() {
      if (!ctx) return;
      // 画一个和可视区域一样大的矩形
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // 画雨滴效果
      ctx.lineWidth = 3;
      lineList.forEach(function (line) {
        ctx.strokeStyle = line.color;
        ctx.beginPath();
        ctx.moveTo(line.posx, line.posy);
        // * speedx 用来控制雨滴方向
        // 使 雨滴方向 和 鼠标移动方向相同
        ctx.lineTo(line.posx + line.h * speedx, line.posy + line.h);
        ctx.stroke();
      });
      // 画雨滴散开形成小水珠效果
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#fff';
      dropList.forEach(function (e) {
        ctx.beginPath();
        ctx.arc(e.posx, e.posy, e.radius, Math.random() * Math.PI * 2, 1 * Math.PI);
        ctx.stroke();
      });
      // 解开注释，可看见鼠标范围
      /*
		      ctx.beginPath();
		      ctx.arc(mousePos[0], mousePos[1], mouseDis, 0, 2 * Math.PI);
		      ctx.stroke();
		    */
    }

    // 开始调用update函数，更新动画
    window.requestAnimationFrame(update);
  };

  window.addEventListener('resize', () => {
    boxWidth = contentBox.clientWidth;
    boxHeight = contentBox.scrollHeight;
    const target = contentBox.querySelector('canvas');
    if (!target) return;
    stop();
    contentBox.removeChild(target);
    setTimeout(createCanvas, 200);
  });

  createCanvas();
}

export function useSakura(selector: string) {
  const contentBox = document.querySelector(selector);
  if (!contentBox) return;
  // const box = contentBox.querySelector('.canvas-box');
  // if (!box) return;
  let boxWidth = contentBox.clientWidth - 10;
  let boxHeight = contentBox.scrollHeight;
  // console.log('contentBox.scrollHeight', contentBox.scrollHeight);

  const createCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = boxWidth - 10;
    canvas.height = boxHeight;
    canvas.style.position = `fixed`;
    canvas.style['z-index'] = 99999;
    canvas.style['pointer-events'] = 'none';
    canvas.style.top = '0';
    contentBox.appendChild(canvas);
    // contentBox?.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const w = boxWidth;
    const h = boxHeight;
    const scales = [7.5, 10, 12.5, 15, 17.5, 20];
    const slen = scales.length - 1;
    const speedX = 2,
      speedY = 3;
    const FlowersNum = 100;

    class Sakura {
      private x: number;
      private y: number;
      private speedX: number;
      private speedY: number;
      private scale: number;
      private width: number;
      private height: number;
      private img: null | HTMLImageElement;
      constructor() {
        this.x = parseInt(Math.random() * w);
        this.y = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.scale = 0;
        this.width = 0;
        this.height = 0;
        this.img = null;
      }

      show(ctx) {
        this.img = new Image();
        const src = Math.random() * 10 > 5 ? sakura01 : sakura02;
        this.img.src = src;

        // 范围内随机大小
        const index = Math.floor(Math.random() * slen);
        this.scale = scales[index];
        this.width = this.height = this.scale;

        this.speedX = Math.random() * speedX;
        this.speedY = Math.random() * speedY;

        this.img.onload = () => {
          ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
        };
      }

      move(ctx) {
        this.x = this.x + this.speedX >= w ? Math.random() * w : this.x + this.speedX;
        this.y = this.y >= h ? 0 : this.y + this.speedY;
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
      }
    }

    const uu = new Sakura();
    uu.show(ctx);

    const flowers: Array<Sakura> = [];

    for (let i = 0; i < FlowersNum; i++) {
      const sakura = new Sakura();
      flowers.push(sakura);
      sakura.show(ctx);
    }

    const move = () => {
      ctx?.clearRect(0, 0, w, h);
      for (let i = 0; i < flowers.length; i++) {
        flowers[i].move(ctx);
      }
    };
    move();

    const timer = setInterval(move, 20);
    const stop = () => {
      clearInterval(timer);
    };

    return { stop };
  };

  window.addEventListener('resize', () => {
    boxWidth = contentBox.clientWidth;
    boxHeight = contentBox.scrollHeight;
    const target = contentBox.querySelector('canvas');
    if (!target) return;
    stop();
    contentBox.removeChild(target);
    setTimeout(createCanvas, 200);
  });

  const { stop } = createCanvas();

  return { stop };
}

export function useSnowy(selector: string) {
  const contentBox = document.querySelector(selector);
  if (!contentBox) return;
  let boxWidth = contentBox.clientWidth - 10;
  let boxHeight = contentBox.scrollHeight;
  let timer;

  const createCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.width = boxWidth - 10;
    canvas.height = boxHeight;
    canvas.style.position = `fixed`;
    canvas.style.top = '0';
    canvas.style['z-index'] = 99999;
    canvas.style['pointer-events'] = 'none';
    contentBox.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const w = boxWidth;
    const h = boxHeight;

    const num = 300,
      tsc = 1;
    const sc = 1.3,
      mv = 20,
      min = 1;
    Snowy();

    function Snowy() {
      class Flake {
        public g: CanvasGradient | undefined;
        public x!: number;
        public y!: number;
        public sz!: number;
        public t = 0;
        public sp = 1;
        draw() {
          if (ctx) {
            this.g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.sz);
            this.g.addColorStop(0, 'hsla(255,255%,255%,1)');
            this.g.addColorStop(1, 'hsla(255,255%,255%,0)');
            ctx.moveTo(this.x, this.y);
            ctx.fillStyle = this.g;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.sz, 0, Math.PI * 2, true);
            ctx.fill();
          }
        }
      }

      const arr: Flake[] = [];

      for (let i = 0; i < num; ++i) {
        const snow = new Flake();
        snow.y = Math.random() * (h + 50);
        snow.x = Math.random() * w;
        snow.t = Math.random() * (Math.PI * 2);
        snow.sz = (100 / (10 + Math.random() * 100)) * sc;
        snow.sp = Math.pow(snow.sz * 0.8, 2) * 0.15 * snow.sp;
        snow.sp = snow.sp < min ? min : snow.sp;
        arr.push(snow);
      }
      go();

      function go() {
        if (!ctx) return;
        window.requestAnimationFrame(go);
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = 'transparent';
        ctx.fillRect(0, 0, w, h);
        ctx.fill();
        for (let i = 0; i < arr.length; ++i) {
          const snowy = arr[i];
          snowy.t += 0.05;
          snowy.t = snowy.t >= Math.PI * 2 ? 0 : snowy.t;
          snowy.y += snowy.sp;
          snowy.x += Math.sin(snowy.t * tsc) * (snowy.sz * 0.3);
          if (snowy.y > h + 50) snowy.y = -10 - Math.random() * mv;
          if (snowy.x > w + mv) snowy.x = -mv;
          if (snowy.x < -mv) snowy.x = w + mv;
          snowy.draw();
        }
      }
    }
  };

  window.addEventListener('resize', () => {
    boxWidth = contentBox.clientWidth;
    boxHeight = contentBox.scrollHeight;
    const target = contentBox.querySelector('canvas');
    if (!target) return;
    if (timer) {
      clearInterval(timer);
    }
    contentBox.removeChild(target);
    timer = setTimeout(createCanvas, 200);
  });

  createCanvas();
}

// const c = document.getElementById('canv'),
//   $ = c.getContext('2d');
// let w = (c.width = window.innerWidth),
//   h = (c.height = window.innerHeight);
// Snowy();

// function Snowy() {
//   let snow,
//     arr = [];
//   const num = 600,
//     tsc = 1,
//     sp = 1;
//   const sc = 1.3,
//     t = 0,
//     mv = 20,
//     min = 1;
//   for (let i = 0; i < num; ++i) {
//     snow = new Flake();
//     snow.y = Math.random() * (h + 50);
//     snow.x = Math.random() * w;
//     snow.t = Math.random() * (Math.PI * 2);
//     snow.sz = (100 / (10 + Math.random() * 100)) * sc;
//     snow.sp = Math.pow(snow.sz * 0.8, 2) * 0.15 * sp;
//     snow.sp = snow.sp < min ? min : snow.sp;
//     arr.push(snow);
//   }
//   go();

//   function go() {
//     window.requestAnimationFrame(go);
//     $.clearRect(0, 0, w, h);
//     $.fillStyle = 'hsla(242, 95%, 3%, 1)';
//     $.fillRect(0, 0, w, h);
//     $.fill();
//     for (let i = 0; i < arr.length; ++i) {
//       f = arr[i];
//       f.t += 0.05;
//       f.t = f.t >= Math.PI * 2 ? 0 : f.t;
//       f.y += f.sp;
//       f.x += Math.sin(f.t * tsc) * (f.sz * 0.3);
//       if (f.y > h + 50) f.y = -10 - Math.random() * mv;
//       if (f.x > w + mv) f.x = -mv;
//       if (f.x < -mv) f.x = w + mv;
//       f.draw();
//     }
//   }

//   function Flake() {
//     this.draw = function () {
//       this.g = $.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.sz);
//       this.g.addColorStop(0, 'hsla(255,255%,255%,1)');
//       this.g.addColorStop(1, 'hsla(255,255%,255%,0)');
//       $.moveTo(this.x, this.y);
//       $.fillStyle = this.g;
//       $.beginPath();
//       $.arc(this.x, this.y, this.sz, 0, Math.PI * 2, true);
//       $.fill();
//     };
//   }
// }
