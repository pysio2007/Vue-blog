<!-- 使用MCIM搜索MOD并显示MOD信息 使用OpenMCIM下载对应MOD （测试版本超级大饼） -->
<template>
    <div class="mod-search-container">
        <!-- 搜索区域 -->
        <div class="search-section">
            <input v-model="searchQuery" @input="debounceSearch" type="text" placeholder="搜索 Mod..."
                class="search-input" />
            <div class="platform-toggles">
                <label>
                    <input type="checkbox" v-model="platforms.curseforge"> CurseForge
                </label>
                <label>
                    <input type="checkbox" v-model="platforms.modrinth"> Modrinth
                </label>
            </div>
        </div>

        <!-- 结果列表/详情切换视图 -->
        <div class="content-area">
            <!-- Mod 列表视图 -->
            <div v-if="!selectedMod" class="results-grid">
                <div v-for="mod in mergedResults" :key="mod.id" class="mod-card" @click="showModDetails(mod)">
                    <img :src="mod.iconUrl" :alt="mod.name" class="mod-icon">
                    <div class="mod-info">
                        <h3>{{ mod.name }}</h3>
                        <p>{{ mod.description }}</p>
                        <div class="mod-meta">
                            <span>{{ mod.downloads }}下载</span>
                            <span>{{ mod.platform }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Mod 详情视图 -->
            <div v-else class="mod-details">
                <button @click="selectedMod = null" class="back-button">
                    返回搜索结果
                </button>
                <div class="detail-header">
                    <img :src="selectedMod.iconUrl" :alt="selectedMod.name">
                    <h2>{{ selectedMod.name }}</h2>
                </div>
                <div class="detail-content">
                    <div class="description" v-html="selectedMod.description"></div>
                    <div class="files-section">
                        <h3>可用版本</h3>
                        <div v-for="file in selectedMod.files" :key="file.id" class="file-item">
                            <span>{{ file.fileName }}</span>
                            <span>{{ file.gameVersion }}</span>
                            <button @click="downloadMod(file)">下载</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { ref, computed } from 'vue'
import debounce from 'lodash/debounce'

export default {
    name: 'ModSearch',
    setup() {
        const searchQuery = ref('')
        const searchResults = ref({ curseforge: [], modrinth: [] })
        const selectedMod = ref(null)
        const platforms = ref({
            curseforge: true,
            modrinth: true
        })

        const MCIM_BASE_URL = 'https://mod.mcimirror.top'

        // 合并搜索结果
        const mergedResults = computed(() => {
            let results = []
            if (platforms.value.curseforge) {
                results = results.concat(searchResults.value.curseforge)
            }
            if (platforms.value.modrinth) {
                results = results.concat(searchResults.value.modrinth)
            }
            return results
        })

        // 搜索功能
        const search = async () => {
            if (!searchQuery.value) return

            try {
                const promises = []

                if (platforms.value.curseforge) {
                    promises.push(
                        axios.get(`${MCIM_BASE_URL}/curseforge/v1/mods/search`, {
                            params: {
                                gameId: 432,
                                searchFilter: searchQuery.value
                            }
                        })
                    )
                }

                if (platforms.value.modrinth) {
                    promises.push(
                        axios.get(`${MCIM_BASE_URL}/modrinth/v2/search`, {
                            params: {
                                query: searchQuery.value
                            }
                        })
                    )
                }

                const results = await Promise.all(promises)

                // 统一处理数据格式
                const processedResults = {
                    curseforge: [],
                    modrinth: []
                }

                if (platforms.value.curseforge && results[0]) {
                    processedResults.curseforge = results[0].data.data.map(mod => ({
                        id: mod.id,
                        name: mod.name,
                        description: mod.summary,
                        downloads: mod.downloadCount,
                        iconUrl: mod.logo?.url || 'path/to/default/icon.png',
                        platform: 'CurseForge',
                        authors: mod.authors.map(author => author.name).join(', '),
                        files: [], // 需要另外请求文件列表
                        categories: mod.categories.map(cat => cat.name)
                    }))
                }

                if (platforms.value.modrinth && results[platforms.value.curseforge ? 1 : 0]) {
                    processedResults.modrinth = results[platforms.value.curseforge ? 1 : 0].data.hits.map(mod => ({
                        id: mod.project_id,
                        name: mod.title,
                        description: mod.description,
                        downloads: mod.downloads,
                        iconUrl: mod.icon_url || 'path/to/default/icon.png',
                        platform: 'Modrinth',
                        authors: mod.author,
                        files: [], // 需要另外请求文件列表
                        categories: mod.categories
                    }))
                }

                searchResults.value = processedResults
            } catch (error) {
                console.error('搜索出错:', error)
            }
        }

        const fetchModDetails = async (mod) => {
            try {
                const endpoint = mod.platform === 'CurseForge'
                    ? `/curseforge/v1/mods/${mod.id}/files`
                    : `/modrinth/v2/project/${mod.id}/version`

                const response = await axios.get(`${MCIM_BASE_URL}${endpoint}`)

                // 统一处理文件列表格式
                if (mod.platform === 'CurseForge') {
                    mod.files = response.data.data.map(file => ({
                        id: file.id,
                        fileName: file.fileName,
                        gameVersion: file.gameVersions?.join(', ') || '未知版本',
                        downloadUrl: `${MCIM_BASE_URL}/files/${mod.id}/${file.id}/${file.fileName}`,
                        platformPath: `/files/${mod.id}/${file.id}/${file.fileName}`
                    }))
                } else {
                    mod.files = response.data.map(file => ({
                        id: file.id,
                        fileName: file.files[0]?.filename || file.name,
                        gameVersion: file.game_versions?.join(', ') || '未知版本',
                        downloadUrl: `${MCIM_BASE_URL}/data/${mod.id}/versions/${file.id}/${file.files[0]?.filename}`,
                        platformPath: `/data/${mod.id}/versions/${file.id}/${file.files[0]?.filename}`
                    }))
                }

                return mod
            } catch (error) {
                console.error('获取mod详情失败:', error)
                return {
                    ...mod,
                    files: []
                }
            }
        }

        const debounceSearch = debounce(search, 500)

        const showModDetails = async (mod) => {
            const modWithDetails = await fetchModDetails(mod)
            selectedMod.value = modWithDetails
        }

        const downloadMod = async (file) => {
            try {
                const response = await axios({
                    url: file.downloadUrl,
                    method: 'GET',
                    responseType: 'blob'
                })

                // 创建下载链接
                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', file.fileName) // 使用原始文件名
                document.body.appendChild(link)
                link.click()

                // 清理
                link.remove()
                window.URL.revokeObjectURL(url)
            } catch (error) {
                console.error('下载出错:', error)
            }
        }

        return {
            searchQuery,
            searchResults,
            selectedMod,
            platforms,
            mergedResults,
            debounceSearch,
            showModDetails,
            downloadMod
        }
    }
}
</script>

<style scoped>
.mod-search-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
}

.search-section {
    margin-bottom: 2rem;
}

.search-input {
    width: 100%;
    padding: 1rem;
    font-size: 1.1rem;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    transition: border-color 0.3s;
}

.search-input:focus {
    border-color: #7c3aed;
    outline: none;
}

.platform-toggles {
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
}

.results-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.5rem;
}

.mod-card {
    background: white;
    border-radius: 12px;
    padding: 1rem;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    border: 1px solid #e0e0e0;
}

.mod-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.mod-icon {
    width: 64px;
    height: 64px;
    border-radius: 8px;
    object-fit: cover;
}

.mod-info {
    margin-top: 1rem;
}

.mod-meta {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
    color: #666;
    font-size: 0.9rem;
}

.mod-details {
    background: white;
    border-radius: 12px;
    padding: 2rem;
}

.back-button {
    padding: 0.5rem 1rem;
    background: #7c3aed;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    margin-bottom: 1rem;
}

.detail-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding: 1rem;
}

.detail-header img {
    width: 96px;
    /* 设置固定宽度 */
    height: 96px;
    /* 设置固定高度 */
    border-radius: 12px;
    /* 圆角效果 */
    object-fit: cover;
    /* 确保图片填充且不变形 */
    border: 2px solid #e0e0e0;
    /* 添加边框 */
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #e0e0e0;
}

.file-item button {
    padding: 0.5rem 1rem;
    background: #7c3aed;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.file-item button:hover {
    background: #6d28d9;
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {

    .mod-card,
    .mod-details {
        background: #1f2937;
        border-color: #374151;
    }

    .search-input {
        background: #1f2937;
        border-color: #374151;
        color: white;
    }

    .mod-meta {
        color: #9ca3af;
    }

    .detail-header img {
        border-color: #374151;
    }
}
</style>