// CraftingTable 图标的 IPFS 映射表
//
// 站内图片已从 s3.pysio.online 迁移至 IPFS。CraftingTable 的
// `icon` 是运行时拼接的名字，无法写死单个 CID，故在此登记它
// 用到的图标。新增图标时补一行即可；未登记的名字会回退到
// /Images 目录 CID 加路径的形式。

/** 公共 IPFS 网关 */
export const IPFS_GATEWAY = 'https://suse.cc/ipfs'

/** /Images 目录自身的 CID，用于未登记图标的回退访问 */
export const IPFS_IMAGES_ROOT_CID =
  'QmcJJkmyFPZopdynade6rr6Sau8xiaRXmyKRQJr2tLCPcD'

/** 图标文件名 -> 文件 CID */
export const IPFS_IMAGES: Record<string, string> = {
  'Aluminium.png': 'QmZArdTXunyYoQQ9W4v9CRtff2rdjuVjhTPkg2fa33kBFL',
  'Alumite.png': 'Qmdajwfa74Au27jW6d7iAmcaDP8TKFvBr6NWMrwM7VF342',
  'Obsidian.png': 'QmTMJZMRGSAKZGYta5s8u4YdrmfCYhBzago83ZzCyA84t7',
  'Steel.png': 'QmU2fGnjz8zkh79SVDWyC7TeGMH9TuAD5HJ8qSSibRvipo',
}

/**
 * 将 `pysioimages/` 内的相对路径解析为 IPFS 网关 URL。
 *
 * 命中映射表时直接使用文件 CID（内容寻址，最稳定）；
 * 未登记时回退到目录 CID 加路径的形式。
 */
export function ipfsImageUrl(path: string): string {
  const cid = IPFS_IMAGES[path]

  if (cid) return `${IPFS_GATEWAY}/${cid}`

  return `${IPFS_GATEWAY}/${IPFS_IMAGES_ROOT_CID}/${path
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')}`
}
