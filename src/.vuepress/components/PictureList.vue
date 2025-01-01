<template>
    <div class="picture-list-container">
        <div class="picture-list-header">
        <div class="header-left">
            <h3 @click="toggleExpand">
            图片库 <span v-if="!initialLoading">({{ totalCount }}张)</span><span v-else>(加载中...)</span>
            <span class="expand-icon" :class="{ 'is-expanded': isExpanded }">
                {{ isExpanded ? '▼' : '▶' }}
            </span>
            </h3>
            <button v-if="!showingAll && totalCount > 0" 
                    @click="loadAllImages" 
                    class="show-all-btn"
                    :disabled="loading">
            显示全部
            </button>
        </div>
        </div>

        <div v-show="isExpanded" class="picture-grid">
        <div v-if="loading" class="loading">
            加载中...
        </div>
        
        <div v-else-if="error" class="error">
            {{ error }}
        </div>

        <template v-else>
            <div v-for="image in images" :key="image.hash" class="picture-item">
            <div class="picture-wrapper">
                <img 
                :src="`https://blogapi.pysio.online/i/${image.hash}`"
                :alt="image.hash"
                loading="lazy"
                @click="showPreview(image)"
                >
            </div>
            <div class="picture-hash">
                {{ image.hash }}
            </div>
            </div>
        </template>

        <div v-if="hasMore && !loading && !showingAll" class="load-more">
            <button @click="loadMore">加载更多</button>
        </div>
        </div>

        <!-- 图片预览模态框 -->
        <div v-if="previewImage" class="modal" @click="closePreview">
        <div class="modal-content">
            <img :src="`https://blogapi.pysio.online/i/${previewImage.hash}`" :alt="previewImage.hash">
            <div class="modal-info">
            <p>Hash: {{ previewImage.hash }}</p>
            <p>上传时间: {{ formatDate(previewImage.createdAt) }}</p>
            </div>
        </div>
        </div>
    </div>
    </template>

    <script>
    // 请求限速器类
    class RateLimiter {
    constructor(maxRequests, timeWindow) {
        this.maxRequests = maxRequests
        this.timeWindow = timeWindow
        this.requests = []
        this.queue = []
        this.processing = false
    }

    async execute(fn) {
        // 清理过期的请求记录
        const now = Date.now()
        this.requests = this.requests.filter(time => now - time < this.timeWindow)

        // 如果当前请求数超过限制，加入队列
        if (this.requests.length >= this.maxRequests) {
        return new Promise((resolve, reject) => {
            this.queue.push({ fn, resolve, reject })
        })
        }

        // 执行请求
        this.requests.push(now)
        try {
        const result = await fn()
        this.processQueue()
        return result
        } catch (error) {
        this.processQueue()
        throw error
        }
    }

    async processQueue() {
        if (this.processing || this.queue.length === 0) return
        this.processing = true

        while (this.queue.length > 0) {
        const now = Date.now()
        this.requests = this.requests.filter(time => now - time < this.timeWindow)

        if (this.requests.length >= this.maxRequests) {
            // 等待一段时间后重试
            await new Promise(resolve => setTimeout(resolve, this.timeWindow / this.maxRequests))
            continue
        }

        const { fn, resolve, reject } = this.queue.shift()
        this.requests.push(now)
        try {
            const result = await fn()
            resolve(result)
        } catch (error) {
            reject(error)
        }
        }

        this.processing = false
    }
    }

    export default {
    name: 'PictureList',
    data() {
        return {
        isExpanded: false,
        images: [],
        totalCount: 0,
        currentPage: 1,
        loading: false,
        initialLoading: true, // 新增：初始加载状态
        error: null,
        previewImage: null,
        pageSize: 12,
        showingAll: false,
        rateLimiter: new RateLimiter(100, 10000), // 10秒100次请求限制
        retryCount: 3, // 最大重试次数
        retryDelay: 1000, // 重试延迟（毫秒）
        }
    },
    
    async created() {
        // 组件创建时就获取总数
        try {
        const response = await fetch('https://blogapi.pysio.online/images/count')
        const data = await response.json()
        this.totalCount = data.count
        } catch (err) {
        this.error = '获取图片总数失败: ' + err.message
        } finally {
        this.initialLoading = false
        }
    },

    computed: {
        hasMore() {
        return !this.showingAll && this.images.length < this.totalCount
        }
    },
    methods: {
        async fetchWithRetry(url, options = {}, retries = this.retryCount) {
        try {
            return await this.rateLimiter.execute(async () => {
            const response = await fetch(url, options)
            if (response.status === 429) { // 如果遇到限速
                throw new Error('Rate limit exceeded')
            }
            return response
            })
        } catch (error) {
            if (retries > 0 && (error.message === 'Rate limit exceeded' || error.name === 'TypeError')) {
            await new Promise(resolve => setTimeout(resolve, this.retryDelay))
            return this.fetchWithRetry(url, options, retries - 1)
            }
            throw error
        }
        },

        async fetchImages() {
        if (this.loading) return // 防止重复加载
        
        this.loading = true
        this.error = null
        try {
            const response = await this.fetchWithRetry(
            `https://blogapi.pysio.online/images/list?page=${this.currentPage}&limit=${this.pageSize}`
            )
            const listData = await response.json()
            
            if (this.currentPage === 1) {
            this.images = listData.images
            } else {
            this.images = [...this.images, ...listData.images]
            }
        } catch (err) {
            this.error = '加载图片失败: ' + err.message
        } finally {
            this.loading = false
        }
        },
        async loadAllImages() {
        this.loading = true
        this.error = null
        this.showingAll = true
        this.isExpanded = true
        
        try {
            const totalPages = Math.ceil(this.totalCount / this.pageSize)
            const requests = []
            
            // 分批处理请求
            for (let page = 1; page <= totalPages; page++) {
            requests.push(async () => {
                const response = await this.fetchWithRetry(
                `https://blogapi.pysio.online/images/list?page=${page}&limit=${this.pageSize}`
                )
                return response.json()
            })
            }
            
            // 使用 reduce 串行处理请求，避免并发过高
            const responses = await requests.reduce(async (promise, request) => {
            const results = await promise
            const result = await request()
            return [...results, result]
            }, Promise.resolve([]))

            this.images = responses.flatMap(data => data.images)
        } catch (err) {
            this.error = '加载所有图片失败: ' + err.message
            this.showingAll = false
        } finally {
            this.loading = false
        }
        },
        toggleExpand() {
        if (this.showingAll) return // 如果显示全部则不允许折叠
        this.isExpanded = !this.isExpanded
        if (this.isExpanded && this.images.length === 0 && !this.loading) {
            this.fetchImages()
        }
        },
        async loadMore() {
        this.currentPage++
        await this.fetchImages()
        },
        showPreview(image) {
        this.previewImage = image
        },
        closePreview() {
        this.previewImage = null
        },
        formatDate(date) {
        return new Date(date).toLocaleString()
        }
    }
    }
    </script>

    <style scoped>
    .picture-list-container {
    margin: 1rem 0;
    border: 1px solid #eaecef;
    border-radius: 8px;
    overflow: hidden;
    }

    .picture-list-header {
    padding: 1rem;
    background-color: #f6f8fa;
    cursor: pointer;
    display: flex;
    justify-content: space-between;
    align-items: center;
    }

    .picture-list-header:hover {
    background-color: #f0f2f4;
    }

    .expand-icon {
    transition: transform 0.3s;
    }

    .expand-icon.is-expanded {
    transform: rotate(180deg);
    }

    .picture-grid {
    padding: 1rem;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
    }

    .picture-item {
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.2s;
    }

    .picture-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    }

    .picture-wrapper {
    aspect-ratio: 1;
    overflow: hidden;
    }

    .picture-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: pointer;
    }

    .picture-hash {
    padding: 0.5rem;
    background: rgba(0,0,0,0.7);
    color: white;
    font-size: 0.8rem;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    }

    .loading, .error {
    grid-column: 1 / -1;
    text-align: center;
    padding: 2rem;
    }

    .load-more {
    grid-column: 1 / -1;
    text-align: center;
    padding: 1rem;
    }

    .load-more button {
    padding: 0.5rem 2rem;
    background: #3eaf7c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    }

    .load-more button:hover {
    background: #369f6b;
    }

    .modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    }

    .modal-content {
    max-width: 90vw;
    max-height: 90vh;
    background: white;
    padding: 1rem;
    border-radius: 8px;
    }

    .modal-content img {
    max-width: 100%;
    max-height: 70vh;
    object-fit: contain;
    }

    .modal-info {
    margin-top: 1rem;
    font-size: 0.9rem;
    }

    @media (max-width: 719px) {
    .picture-grid {
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
    }

    /* 添加加载状态样式 */
    .picture-list-header h3 span {
    font-size: 0.9em;
    color: #666;
    }

    .header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
    }

    .show-all-btn {
    padding: 0.3rem 1rem;
    background: #4a9eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
    }

    .show-all-btn:hover {
    background: #3288e6;
    }

    .show-all-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    }

    .picture-list-header h3 {
    cursor: pointer;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    }

    /* 添加加载进度提示样式 */
    .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    }

    .loading::after {
    content: "请求已限速，请耐心等待...";
    font-size: 0.9em;
    color: #666;
    }
    </style>
