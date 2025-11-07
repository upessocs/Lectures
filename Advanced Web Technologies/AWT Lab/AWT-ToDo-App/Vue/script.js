
const STORAGE_KEY = "tasks-vue";
const { createApp, ref, watch, onMounted } = Vue;

createApp({
  setup() {
    const tasks = ref([]);
    const text = ref("");

    onMounted(() => {
      try { tasks.value = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
      catch (e) { tasks.value = []; }
    });

    watch(tasks, (val) => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
    }, { deep: true });

    function addTask() {
      const t = text.value.trim();
      if (!t) return;
      tasks.value.push({ text: t, done: false });
      text.value = "";
    }
    function toggle(i) { tasks.value[i].done = !tasks.value[i].done; }
    function remove(i) { tasks.value.splice(i, 1); }

    return { tasks, text, addTask, toggle, remove };
  }
}).mount("#app");
