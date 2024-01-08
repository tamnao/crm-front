<template>
    <div style="text-align: center">
        <el-icon class="is-loading loading-size"><loading /></el-icon>
    </div>
</template>

<script lang="ts">
    import { defineComponent} from '@vue/runtime-core'; 
    import { Loading } from '@element-plus/icons';

    export default defineComponent({
        components: {
            "loading" : Loading
        },

        setup() {
            return {}
        }
    })
</script>