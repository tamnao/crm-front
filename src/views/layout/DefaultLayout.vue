<template>
    <el-container id="nav">
        <el-aside width="260px">
            <left-menu />
        </el-aside>
        <el-container>
            <el-main>
                <router-view />
            </el-main>
            <el-footer>
                <hub-footer />
            </el-footer>
        </el-container>
    </el-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HubFooter from "@/views/layout/Footer.vue";
import LeftMenu from "@/components/layout/LeftMenu.vue";

export default defineComponent({
    inheritAttrs: false,
    components: {
        HubFooter,
        LeftMenu
    },
})
</script>


<style scoped>
    .el-main {
        padding-top: 0px;
    }
</style>
