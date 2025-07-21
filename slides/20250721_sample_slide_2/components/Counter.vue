<script lang="ts" setup>
import {ref} from 'vue'

const props = defineProps({
  count: {
    default: 0,
  },
})

const counter = ref(props.count)
</script>

<template>
  <div border="~ main rounded-md" flex="~" w="min">
    <button
        border="r main"
        font="mono"
        hover:bg="gray-400 opacity-20"
        outline="!none"
        p="2"
        @click="counter -= 1"
    >
      -
    </button>
    <span m="auto" p="2">{{ counter }}</span>
    <button
        border="l main"
        font="mono"
        hover:bg="gray-400 opacity-20"
        outline="!none"
        p="2"
        @click="counter += 1"
    >
      +
    </button>
  </div>
</template>
