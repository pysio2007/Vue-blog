<script>
export default {
    // 组件名称
    name: 'CraftingTable',
    // 组件属性定义
    props: {
        // 合成格子内的物品数组，默认9个空位
        items: {
            type: Array,
            default: () => Array(9).fill(null)
        },
        // 合成结果物品
        result: {
            type: Object,
            default: null
        }
    },
    methods: {
        // 获取物品图标URL的方法
        getIconUrl(icon) {
            if (!icon) return '';
            // 如果是完整URL或以/开头的路径则直接返回
            // 否则拼接默认CDN路径
            return icon.startsWith('http') || icon.startsWith('/') ?
                icon :
                `https://s3.pysio.online/cdn-cgi/image/f=avif,onerror=redirect/https://s3.pysio.online/pysioimages/${icon}.png`;
        }
    }
}
</script>

<template>
    <!-- 合成表主容器 -->
    <div class="crafting-table">
        <!-- 合成区域容器 -->
        <div class="crafting-grid">
            <!-- 3x3合成格子区域 -->
            <div class="grid-container">
                <!-- 循环渲染9个物品格子 -->
                <div v-for="(item, index) in items" :key="index" class="grid-slot">
                    <!-- 如果格子有物品则显示物品信息 -->
                    <div v-if="item" class="item">
                        <!-- 物品图标 -->
                        <img :src="getIconUrl(item.icon)" :alt="item.name">
                        <!-- 如果数量大于1则显示数量 -->
                        <span v-if="item.count > 1" class="count">{{ item.count }}</span>
                        <!-- 鼠标悬停时显示物品名称 -->
                        <span class="tooltip">{{ item.name }}</span>
                    </div>
                </div>
            </div>
            <!-- 箭头指示符 -->
            <div class="arrow">→</div>
            <!-- 合成结果格子 -->
            <div class="result-slot">
                <!-- 如果有合成结果则显示结果物品 -->
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
/* 合成表外观样式 - Minecraft风格 */
.crafting-table {
    display: inline-block;
    padding: 10px;
    background: #C6C6C6; /* 浅灰色背景 */
    border: 2px solid #373737; /* 深色边框 */
    border-radius: 4px;
}

/* 合成区域布局 */
.crafting-grid {
    display: flex;
    align-items: center;
    gap: 10px;
}

/* 3x3网格容器样式 */
.grid-container {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    background: #8B8B8B; /* 中灰色背景 */
    padding: 5px;
    border: 2px solid #373737;
}

/* 单个物品格子样式 */
.grid-slot {
    width: 32px;
    height: 32px;
    background: #b3b1b1; /* 格子背景色 */
    border: 2px solid #8B8B8B;
}

/* 箭头样式 */
.arrow {
    font-size: 24px;
    color: #373737;
    margin: 0 10px;
    text-shadow: none;
}

/* 结果格子样式 */
.result-slot {
    width: 32px;
    height: 32px;
    background: #E0E0E0; /* 较亮的背景色 */
    border: 2px solid #8B8B8B;
}

/* 物品通用样式 */
.item {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* 物品图标样式 */
.item img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

/* 悬停提示框样式 */
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

/* 悬停时显示提示框 */
.item:hover .tooltip {
    opacity: 1;
    visibility: visible;
}

/* 物品数量样式 */
.count {
    position: absolute;
    right: 1px;
    bottom: 1px;
    font-size: 12px;
    color: white;
    text-shadow: 1px 1px 1px #000; /* 数字描边效果 */
    font-weight: bold;
}
</style>