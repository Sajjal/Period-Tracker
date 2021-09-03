<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container column>
      <q-toolbar class="bg-black text-white q-pt-sm q-pb-sm q-mb-sm">
        <q-icon name="pivot_table_chart" size="2.5em" flat class="q-ml-none q-pl-xs" />
        <q-toolbar-title>
          <q-item-label class="text-white"> S & D Period Tracker</q-item-label>
        </q-toolbar-title>

        <q-btn round color="negative" icon="logout" dense class="q-pr-sm" @click="logoutUser" />
      </q-toolbar>

      <q-item>
        <q-item-section class="q-pl-xs">
          <q-item class="bg-grey-2 text-black soft-border today_date">
            <q-icon left size="2em" name="add_circle_outline" color="primary" style="cursor: pointer" @click="add_new_data()" />
            <q-item-section>
              <q-item-label> {{ today }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-item-section>
        <q-item-section class="q-pl-xs q-pr-xs">
          <q-item class="bg-grey-2 text-black soft-border next_estimated">
            <q-icon left size="2em" name="redo" color="accent" />
            <q-item-section>
              <q-item-label> {{ next_from }}-{{ next_to }} </q-item-label>
            </q-item-section>
          </q-item>
        </q-item-section>
      </q-item>
      <div class="q-pt-sm q-pl-md q-pr-md soft-border">
        <q-table
          :rows="rows"
          :columns="columns"
          :visible-columns="visible_cols"
          style="max-height: 450px"
          row-key="name"
          dark
          virtual-scroll
          v-model:pagination="pagination"
          :rows-per-page-options="[0]"
          :hide-pagination="true"
          class="data-table"
        />
      </div>

      <q-item-label class="bg-grey-2 text-black soft-border q-ma-md q-mt-md q-pa-sm text-center"> S & D Period Tracker | github: @Sajjal </q-item-label>

      <q-dialog v-model="open_dialog" persistent transition-show="scale" transition-hide="scale">
        <q-card class="bg-grey-2 text-black" style="width: 300px">
          <q-card-section class="q-pa-md text-subtitle2"> Add Period Record for {{ today }}? </q-card-section>

          <q-card-actions align="right" class="bg-white text-teal">
            <q-btn flat label="No" class="text-negative" v-close-popup />
            <q-btn flat label="Yes" @click="add_new_data(true)" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { date } from 'quasar';
import readWriteData from '../composables/readWriteData';

const columns = [
  {
    name: 'date',
    label: 'Date',
    align: 'left',
    field: 'pDate',
    headerStyle: 'font-weight:bold'
  },
  {
    name: 'timeStamp',
    label: 'TimeStamp',
    align: 'left',
    field: 'timestamp',
    headerStyle: 'font-weight:bold'
  },
  {
    name: 'pCycle',
    label: 'Period Cycle',
    align: 'center',
    field: 'pCycle',
    headerStyle: 'font-weight:bold'
  },
  {
    name: 'healthStatus',
    label: 'Health Status',
    align: 'center',
    field: 'status',
    headerStyle: 'font-weight:bold',
    style: (row) => {
      return row.status == 'Healthy' ? 'color:#6be016' : 'color:red';
    }
  }
];

const visible_cols = ['date', 'pCycle', 'healthStatus'];
const rows = ref([]);
const open_dialog = ref(false);

const last_period_timeStamp = ref();
const next_from = ref();
const next_to = ref();

export default {
  setup() {
    const router = useRouter();
    const { getData, addData, logout } = readWriteData();

    async function getServerData() {
      let data = await getData();
      for (let i = 0; i < data.length; i++) {
        rows.value.push({ pDate: getDateString(data[i].pDate).fullDate, pCycle: data[i].pCycle, status: data[i].status, timeStamp: data[i].pDate });
      }
      let last_period_cycle = rows.value[rows.value.length - 1].pCycle;
      last_period_timeStamp.value = rows.value[rows.value.length - 1].timeStamp;
      getEstimatedDate(last_period_cycle);
    }
    getServerData();

    function getDateString(timeStamp) {
      return { fullDate: date.formatDate(timeStamp, 'MMM DD YYYY'), month_day: date.formatDate(timeStamp, 'MMM DD') };
    }

    // Estimated
    function getEstimatedDate(pCycle) {
      let from = date.addToDate(new Date(last_period_timeStamp.value), { days: parseInt(pCycle) });
      let to = date.addToDate(new Date(last_period_timeStamp.value), { days: parseInt(pCycle) + 3 });
      next_from.value = getDateString(from.getTime()).month_day;
      next_to.value = getDateString(to.getTime()).month_day;
    }

    async function add_new_data(confirm = false) {
      if (!confirm) return (open_dialog.value = true);
      else {
        open_dialog.value = false;

        // Check if record already exists
        let today = getDateString(Date.now()).fullDate;
        const checkIfDataExists = (obj) => obj.pDate == today;
        if (rows.value.some(checkIfDataExists)) return;
        else {
          let pCycle = date.getDateDiff(new Date(), new Date(rows.value[rows.value.length - 1].timeStamp), 'days');
          let healthStatus = parseInt(pCycle) < 28 || parseInt(pCycle) > 35 ? 'Weak' : 'Healthy';
          let local_data = { pDate: getDateString(Date.now()).fullDate, pCycle, status: healthStatus, timeStamp: Date.now() };
          let data_to_server = { pDate: local_data.timeStamp, pCycle, status: healthStatus };

          await addData(data_to_server);

          rows.value.push(local_data);
          last_period_timeStamp.value = local_data.timeStamp;
          getEstimatedDate(pCycle);
        }
      }
    }

    async function logoutUser() {
      await logout();
      router.push({ name: 'Login' });
    }

    return {
      pagination: ref({ rowsPerPage: 0, sortBy: 'timeStamp' }),
      columns,
      visible_cols,
      rows,
      open_dialog,
      today: getDateString(Date.now()).fullDate,
      next_from,
      next_to,
      add_new_data,
      logoutUser
    };
  }
};
</script>

<style lang="sass">
.subheading
  font-size: 15px
.soft-border
  border-radius: 6px
.today_date
  min-width: 148px
.next_estimated
  min-width: 168px

.data-table
  -ms-overflow-style: none
  scrollbar-width: none
  thead tr:first-child th
    background-color: #1D1D1D
  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0
  ::-webkit-scrollbar
    display: none

*
  -ms-touch-action: manipulation
  touch-action: manipulation
</style>