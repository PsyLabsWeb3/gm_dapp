/**
 * Resolve image field from metadata, handling relative paths
 * @param imageField - The image field from metadata (may be relative)
 * @param metadataUrl - The full metadata URL (used as base for relative paths)
 * @returns Fully resolved HTTP(S) image URL
 */
export function resolveImageFromMetadata(
  imageField: string,
  metadataUrl: string,
): string {
  // Always resolve relative to the HTTP metadata URL (not ipfs://)
  const baseUrl = ipfsToHttp(metadataUrl);
  let resolved: string;
  if (imageField.startsWith("http") || imageField.startsWith("ipfs://")) {
    resolved = imageField;
  } else {
    // resolve relative to metadata.json location
    resolved = new URL(imageField, baseUrl).toString();
  }
  return ipfsToHttp(resolved);
}
/**
 * ERC1155 ABI and helper functions for GameItems NFT contract
 * Supports batch operations and metadata resolution
 */

/**
 * Minimal ERC1155 ABI for GameItems contract
 * Includes balanceOfBatch and uri functions
 */
export const ERC1155_ABI = [
  {
    inputs: [
      {
        internalType: "address[]",
        name: "accounts",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ids",
        type: "uint256[]",
      },
    ],
    name: "balanceOfBatch",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
    ],
    name: "uri",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * Convert a number or bigint to 64-character hex string (lowercase, no 0x prefix)
 * Used to format token IDs for URI template substitution
 *
 * @param id - The token ID to convert
 * @returns 64-char hex string (lowercase)
 * @example
 * toHexPadded64(1n) => "0000000000000000000000000000000000000000000000000000000000000001"
 */
export function toHexPadded64(id: bigint | number): string {
  const hex = (typeof id === "bigint" ? id : BigInt(id)).toString(16);
  return hex.padStart(64, "0").toLowerCase();
}

/**
 * Resolve an ERC1155 URI template by replacing {id} with the padded hex token ID
 * Also converts IPFS URLs to HTTP gateways
 *
 * @param template - The URI template (may contain {id} placeholder)
 * @param id - The token ID
 * @returns Resolved URI
 * @example
 * resolveErc1155Uri("ipfs://Qm.../metadata/{id}.json", 1n)
 * => "https://ipfs.io/ipfs/Qm.../metadata/0000...0001.json"
 */
export function resolveErc1155Uri(
  template: string,
  id: bigint | number,
): string {
  const idDec = typeof id === "bigint" ? id.toString() : String(id);
  let url = template.replaceAll("{id}", idDec);
  // some contracts use {ID} (uppercase) too
  url = url.replaceAll("{ID}", idDec);
  return ipfsToHttp(url);
}

/**
 * Convert IPFS URLs to HTTP gateway URLs
 * Handles ipfs:// protocol URLs and leaves HTTP(S) URLs unchanged
 *
 * @param url - The URL to convert
 * @returns HTTP(S) gateway URL
 * @example
 * ipfsToHttp("ipfs://QmXxxx...) => "https://ipfs.io/ipfs/QmXxxx"
 * ipfsToHttp("https://example.com/...") => "https://example.com/..."
 */
export function ipfsToHttp(url: string): string {
  if (url.startsWith("ipfs://")) {
    const ipfsHash = url.slice("ipfs://".length);
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  }
  return url;
}

/**
 * Parse metadata JSON response
 * Extracts name, image, rarity, and other attributes
 */
export interface MetadataItem {
  name?: string;
  description?: string;
  image?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

/**
 * Extract rarity value from metadata attributes
 *
 * @param metadata - Parsed metadata object
 * @returns Rarity value or undefined
 */
export function extractRarity(metadata: MetadataItem): string | undefined {
  if (!metadata.attributes) return undefined;
  const rarityAttr = metadata.attributes.find(
    (attr) => attr.trait_type?.toLowerCase() === "rarity",
  );
  return rarityAttr?.value ? String(rarityAttr.value) : undefined;
}

/**
 * Batch item with balance and metadata
 */
export interface GameItem {
  tokenId: number | bigint;
  balance: bigint;
  name?: string;
  image?: string;
  attributes?: MetadataItem["attributes"];
  rarity?: string;
  metadataUrl?: string;
}
