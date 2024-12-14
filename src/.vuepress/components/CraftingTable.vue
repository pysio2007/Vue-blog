<script>
export default {
    name: 'CraftingTable',
    props: {
        items: {
            type: Array,
            default: () => Array(9).fill(null)
        },
        result: {
            type: Object,
            default: null
        }
    },
    methods: {
        getIconUrl(icon) {
            if (!icon) return '';
            // 检查是否为完整URL
            return icon.startsWith('http') || icon.startsWith('/') ?
                icon :
                `https://files.pysio.online/files/Pysio-Imges/${icon}.png`;
        }
    }
}
</script>

<template>
    <div class="crafting-table">
        <div class="crafting-grid">
            <div class="grid-container">
                <div v-for="(item, index) in items" :key="index" class="grid-slot">
                    <div v-if="item" class="item">
                        <img :src="getIconUrl(item.icon)" :alt="item.name">
                        <span v-if="item.count > 1" class="count">{{ item.count }}</span>
                        <span class="tooltip">{{ item.name }}</span>
                    </div>
                </div>
            </div>
            <div class="arrow">→</div>
            <div class="result-slot">
                <div v-if="result" class="item result">
                    <img :src="getIconUrl(result.icon)" :alt="result.name">
                    <span v-if="result.count > 1" class="count">{{ result.count }}</span>
                    <span class="tooltip">{{ result.name }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.crafting-table {
    display: inline-block;
    padding: 10px;
    background: #C6C6C6;
    border: 2px solid #373737;
    border-radius: 4px;
}

.crafting-grid {
    display: flex;
    align-items: center;
    gap: 10px;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    background: #8B8B8B;
    padding: 5px;
    border: 2px solid #373737;
}

.grid-slot {
    width: 32px;
    height: 32px;
    background: #b3b1b1;
    border: 2px solid #8B8B8B;
}

.arrow {
    font-size: 24px;
    color: #373737;
    margin: 0 10px;
    text-shadow: none;
}

.result-slot {
    width: 32px;
    height: 32px;
    background: #E0E0E0;
    border: 2px solid #8B8B8B;
}

.item {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.item img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.tooltip {
    position: absolute;
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #100010;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: 0.2s ease;
}

.item:hover .tooltip {
    opacity: 1;
    visibility: visible;
}

.count {
    position: absolute;
    right: 1px;
    bottom: 1px;
    font-size: 12px;
    color: white;
    text-shadow: 1px 1px 1px #000;
    font-weight: bold;
}
</style>