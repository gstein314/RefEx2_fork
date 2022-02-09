<template> 
    <th class="age" v-if="isDisplayed">
        <span v-if="subLabel">
            {{ label }}<br>
            <span class="small">{{ subLabel }}</span>
        </span>
        <template v-else> {{ label }}</template>
        <slot></slot>
        <font-awesome-icon
            :icon="currentSort.active === id ? `sort-${currentSort.order}` : 'sort'"
            @click="switchSort"
        />
        <font-awesome-icon
            icon="search"
            :class="{'active' : isActiveSearch}"
            @click="openFilterModal"
        />
    </th>
</template>

<script>
export default {
    props: {
        id: {
            type: String,
            required: true
        },
        label: {
            type: String,
            default: '',
        },
        subLabel: {
            type: String,
            required: false,
        },
        innerKey: {
            type: String,
            default: '',
        },
        isDisplayed: {
            type: Boolean,
            default: true,
        },
        numberValue: {
            type: Object,
            required: false,
        },
        currentSort: {
            type: Object,
            required: true,
        },
    },
    computed: {
        isActiveSearch() {
            return this.numberValue ? this.numberValue.value[0] !== 0 || this.numberValue.value[1] !== this.numberValue.max : false;
        }
    },
    methods: {
        switchSort() {
            this.$emit('switchSort', this.id)
        },
        openFilterModal() {
            this.$emit('openFilterModal', this.id)
        }
    }
}
</script>
