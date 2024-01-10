<template>
  <div>
    <!-- custom-scrollbar -->
    <div ref="elemRef" class="complex-component-example cutom-scrollbar">
      <div class="content-wrapper">
        <pre class="content">
// use-scrollbar
function hello2() {
  console.log('hello world!')
  console.log('I like cola and cola and longcola and longcola and longcola and longcola and longcola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
}

function world() {
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
}

function world() {
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
  console.log('hello world!')
  console.log('I like cola and cola')
}
          </pre
        >
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useScrollbar } from 'use-scrollbars'
import { ref } from 'vue'

const elemRef = ref<HTMLElement>()
useScrollbar(elemRef)
</script>

<style scoped>
.complex-component-example {
  position: relative;
  width: 600px;
  height: 372px;
  border: solid 2px black;
  background: #eeeeee;
}

.content-wrapper {
  overflow: auto auto;
  width: 100%;
  height: 100%;
  background: #f8f8f8;
  box-sizing: border-box;
}

.complex-component-example .content {
  margin: 0;
  width: max-content;
  color: #000000;
}

.complex-component-example.cutom-scrollbar .content-wrapper::-webkit-scrollbar {
  width: 0;
  height: 0;
}
</style>
