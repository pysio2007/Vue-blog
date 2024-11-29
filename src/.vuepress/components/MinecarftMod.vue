<!-- 使用MCIM搜索MOD并显示MOD信息 使用OpenMCIM下载对应MOD （测试版本超级大饼） -->
<template>
    <div class="mod-search-container">
        <!-- 仅在非详情页显示搜索区域 -->
        <div class="search-section" v-if="!selectedMod">
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
                <div v-if="selectedMod" class="mod-details">
                    <button @click="selectedMod = null" class="back-button">
                        ← 返回
                    </button>
                    <div class="detail-header">
                        <img :src="selectedMod.iconUrl" :alt="selectedMod.name">
                        <h2>{{ selectedMod.name }}</h2>
                    </div>
                    <!-- <div class="detail-content">
              <div class="description" v-html="selectedMod.description"></div>
              <div class="files-section">
                <h3>可用版本</h3>
                <div v-for="file in selectedMod.files" :key="file.id" class="file-item">
                  <span>{{ file.fileName }}</span>
                  <span>{{ file.gameVersion }}</span>
                  <button @click="downloadMod(file)">下载</button>
                </div>
              </div>
            </div> -->
                </div>

                <!-- 筛选区域 -->
                <div class="filters-section">
                    <div class="filter-group">
                        <select v-model="selectedVersion" @change="filterFiles">
                            <option value="">所有版本</option>
                            <option v-for="version in availableVersions" :key="version" :value="version">
                                {{ version }}
                            </option>
                        </select>
                        <!-- 暂时移除加载器选择
              <select v-model="selectedLoader" @change="filterFiles">
                <option value="">所有加载器</option>
                <option v-for="loader in availableLoaders" :key="loader" :value="loader">
                  {{ loader }}
                </option>
              </select>
              -->
                    </div>
                </div>

                <div class="detail-header">
                    <img :src="selectedMod.iconUrl" :alt="selectedMod.name">
                    <h2>{{ selectedMod.name }}</h2>
                </div>

                <div class="detail-content">
                    <div class="description" v-html="selectedMod.description"></div>
                    <div class="files-section">
                        <h3>可用版本</h3>
                        <div v-for="file in paginatedFiles" :key="file.id" class="file-item">
                            <span>{{ file.fileName }}</span>
                            <span>{{ file.gameVersion }}</span>
                            <button @click="downloadMod(file)">下载</button>
                        </div>

                        <!-- 分页控制 -->
                        <div class="pagination">
                            <button :disabled="currentPage === 1" @click="currentPage--" class="pagination-button">
                                上一页
                            </button>
                            <span>{{ currentPage }} / {{ totalPages }}</span>
                            <button :disabled="currentPage === totalPages" @click="currentPage++"
                                class="pagination-button">
                                下一页
                            </button>
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
        const selectedVersion = ref('')
        // const selectedLoader = ref('')  // 暂时注释掉加载器相关变量
        const currentPage = ref(1)
        const pageSize = ref(10)
        const searchQuery = ref('')
        const searchResults = ref({ curseforge: [], modrinth: [] })
        const selectedMod = ref(null)
        const platforms = ref({
            curseforge: true,
            modrinth: true
        })

        const MCIM_BASE_URL = 'https://mod.mcimirror.top'
        const CDN_BASE_URL = 'https://cdn.akaere.online/https://mod.mcimirror.top'

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
                        }).catch(() => {
                            // 主链接失败时使用CDN
                            return axios.get(`${CDN_BASE_URL}/curseforge/v1/mods/search`, {
                                params: {
                                    gameId: 432,
                                    searchFilter: searchQuery.value
                                }
                            })
                        })
                    )
                }

                if (platforms.value.modrinth) {
                    promises.push(
                        axios.get(`${MCIM_BASE_URL}/modrinth/v2/search`, {
                            params: {
                                query: searchQuery.value
                            }
                        }).catch(() => {
                            return axios.get(`${CDN_BASE_URL}/modrinth/v2/search`, {
                                params: {
                                    query: searchQuery.value
                                }
                            })
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
                    .catch(() => {
                        return axios.get(`${CDN_BASE_URL}${endpoint}`)
                    })

                // 添加CDN URL到文件下载路径
                if (mod.platform === 'CurseForge') {
                    mod.files = response.data.data.map(file => ({
                        ...file,
                        downloadUrl: `${MCIM_BASE_URL}/files/${mod.id}/${file.id}/${file.fileName}`,
                        cdnDownloadUrl: `${CDN_BASE_URL}/files/${mod.id}/${file.id}/${file.fileName}`
                    }))
                } else {
                    mod.files = response.data.map(file => ({
                        ...file,
                        downloadUrl: `${MCIM_BASE_URL}/data/${mod.id}/versions/${file.id}/${file.files[0]?.filename}`,
                        cdnDownloadUrl: `${CDN_BASE_URL}/data/${mod.id}/versions/${file.id}/${file.files[0]?.filename}`
                    }))
                }
                return mod
            } catch (error) {
                console.error('获取mod详情失败:', error)
                return { ...mod, files: [] }
            }
        }

        const debounceSearch = debounce(search, 500)

        const showModDetails = async (mod) => {
            const modWithDetails = await fetchModDetails(mod)
            selectedMod.value = modWithDetails
        }

        const downloadMod = async (file) => {
            try {
                // 先尝试主链接
                const response = await axios({
                    url: file.downloadUrl,
                    method: 'GET',
                    responseType: 'blob'
                }).catch(async () => {
                    // 主链接失败时使用CDN链接
                    return axios({
                        url: file.cdnDownloadUrl,
                        method: 'GET',
                        responseType: 'blob'
                    })
                })

                const url = window.URL.createObjectURL(new Blob([response.data]))
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', file.fileName)
                document.body.appendChild(link)
                link.click()
                link.remove()
                window.URL.revokeObjectURL(url)
            } catch (error) {
                console.error('下载出错:', error)
            }
        }

        const availableVersions = computed(() => {
            if (!selectedMod.value?.files) return []
            const versions = new Set()

            selectedMod.value.files.forEach(file => {
                // 根据不同平台处理版本信息
                if (selectedMod.value.platform === 'CurseForge') {
                    // CurseForge的版本信息在 gameVersion 数组中
                    file.gameVersion?.forEach(version => versions.add(version))
                } else {
                    // Modrinth的版本信息在 game_versions 数组中
                    file.game_versions?.forEach(version => versions.add(version))
                }
            })

            return Array.from(versions).sort((a, b) => {
                // 版本号排序逻辑
                return b.localeCompare(a, undefined, { numeric: true })
            })
        })

        const availableLoaders = computed(() => {
            if (!selectedMod.value?.files) return []
            const loaders = new Set()
            selectedMod.value.files.forEach(file => {
                // 从文件名推断加载器类型
                if (file.fileName.toLowerCase().includes('forge')) loaders.add('Forge')
                if (file.fileName.toLowerCase().includes('fabric')) loaders.add('Fabric')
                if (file.fileName.toLowerCase().includes('quilt')) loaders.add('Quilt')
            })
            return Array.from(loaders)
        })

        // 筛选文件列表
        const filteredFiles = computed(() => {
            if (!selectedMod.value?.files) return []

            return selectedMod.value.files.filter(file => {
                if (!selectedVersion.value) return true

                // 根据不同平台检查版本匹配
                if (selectedMod.value.platform === 'CurseForge') {
                    return file.gameVersion?.includes(selectedVersion.value)
                } else {
                    return file.game_versions?.includes(selectedVersion.value)
                }
            })
        })

        // 分页处理
        const totalPages = computed(() =>
            Math.ceil(filteredFiles.value.length / pageSize.value)
        )

        const paginatedFiles = computed(() => {
            const start = (currentPage.value - 1) * pageSize.value
            const end = start + pageSize.value
            return filteredFiles.value.slice(start, end)
        })

        // 重置筛选和分页
        const resetFilters = () => {
            selectedVersion.value = ''
            // selectedLoader.value = ''
            currentPage.value = 1
        }

        // 筛选变化时重置页码
        const filterFiles = () => {
            currentPage.value = 1
        }

        return {
            searchQuery,
            searchResults,
            selectedMod,
            platforms,
            mergedResults,
            debounceSearch,
            showModDetails,
            downloadMod,
            filterFiles,
            selectedVersion,
            // selectedLoader,
            currentPage,
            availableVersions,
            availableLoaders,
            paginatedFiles,
            totalPages,
            resetFilters
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
    position: fixed;
    left: 2rem;
    top: 1rem;
    /* 调整返回按钮位置 */
    z-index: 100;
}

.detail-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    padding: 1rem;
}

.filters-section {
    margin: 1rem 0;
    padding: 1rem;
    background: rgba(124, 58, 237, 0.1);
    border-radius: 8px;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;
}

.pagination-button {
    padding: 0.5rem 1rem;
    background: #7c3aed;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
}

.pagination-button:disabled {
    background: #9ca3af;
    cursor: not-allowed;
}

.filter-group {
    display: flex;
    gap: 1rem;
}

.filter-group select {
    padding: 0.5rem;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
    background: white;
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

.mod-details {
    position: relative;
    /* 用于定位返回按钮 */
}

.back-button {
    position: absolute;
    left: 1rem;
    top: 1rem;
    z-index: 1;
    padding: 0.5rem 1rem;
    background: #7c3aed;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.back-button:hover {
    background: #6d28d9;
}

/* 暗色主题支持 */
@media (prefers-color-scheme: dark) {
    .filter-group select {
        background: #1f2937;
        border-color: #374151;
        color: white;
    }

    .filters-section {
        background: rgba(124, 58, 237, 0.05);
    }

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