import Business from "./BusinessTime.vue";
class Person {}
const name = "zxf";
const getName = (prefix: string) => {
  const p = new Map();
  p.set(new Person(), 1);
  return prefix + name + p;
};
export default {
  // install(Vue) {
  //   getName("");
  //   Vue.use("bu", Business);
  // },
  install(Vue: { use: (name: string, c: unknown) => void }) {
    getName("");
    Vue.use("bu", Business);
  },
};

// import { customRef } from "vue";

// document.body.innerHTML = customRef.toString();
