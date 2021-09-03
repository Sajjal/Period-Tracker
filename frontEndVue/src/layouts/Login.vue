<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container column>
      <q-toolbar class="bg-black text-white q-pt-sm q-pb-sm q-mb-sm">
        <q-icon name="pivot_table_chart" size="2.5em" flat class="q-ml-none q-pl-xs" />
        <q-toolbar-title>
          <q-item-label class="text-white"> S & D Period Tracker</q-item-label>
        </q-toolbar-title>
      </q-toolbar>
      <q-input dark filled v-model="input" label="Please Enter the Access Code !" @keyup.enter="handleSubmit" class="q-pa-md">
        <template v-slot:append>
          <q-icon v-if="input === ''" name="lock" />
          <q-icon v-else name="clear" class="cursor-pointer" @click="input = ''" />
        </template>
      </q-input>

      <q-banner dense class="bg-red text-white q-mt-xs q-ml-md q-mr-md q-mb-sm" v-if="loginError">
        <template v-slot:avatar>
          <q-icon name="report" />
        </template>
        {{ loginError }}
      </q-banner>

      <div class="q-mt-sm q-ml-md q-mr-md">
        <q-btn color="primary" icon-right="send" label="Submit" class="full-width" @click="handleSubmit" />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import readWriteData from '../composables/readWriteData';

export default {
  setup() {
    const router = useRouter();
    const input = ref('');
    const loginError = ref('');

    const { login } = readWriteData();

    async function handleSubmit() {
      if (!input.value) return (loginError.value = 'Access Code is Required!');
      let loginStatus = await login({ accessCode: input.value });
      if (loginStatus.Error) return (loginError.value = loginStatus.Error);
      else {
        loginError.value = '';
        router.push({ name: 'Dashboard' });
      }
    }
    return {
      input,
      loginError,
      handleSubmit
    };
  }
};
</script>
