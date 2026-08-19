/**
 * Mock R2 Service for stress testing
 * 
 * Mocks Cloudflare R2 interactions without actual cloud storage
 * Allows testing upload flow without occupying space or hitting rate limits
 */

export function createMockR2Service() {
  let uploadFileResolve: ((value: { success: boolean; key?: string; url?: string; error?: string }) => void);
  let uploadFilePromise: Promise<{ success: boolean; key?: string; url?: string; error?: string }>;

  const uploadFile = async (filePath: string, key: string, contentType?: string): Promise<{ success: boolean; key?: string; url?: string; error?: string }> => {
    if (uploadFileResolve) {
      const result = uploadFileResolve({ success: true, key, url: `https://example.com/${key}` });
      uploadFileResolve = undefined;
      return result;
    }
    return { success: true, key, url: `https://example.com/${key}` };
  };

  const renameObject = async (oldKey: string, newKey: string): Promise<{ success: boolean }> => {
    return { success: true };
  };

  const isFileTooSmall = (filePath: string): boolean => {
    return false;
  };

  const getPublicUrl = (key: string): string => {
    return `https://example.com/${key}`;
  };

  const uploadFileFn = ((cb: typeof uploadFileResolve) => {
    uploadFileResolve = cb;
    return uploadFile;
  }) as typeof uploadFile;

  return {
    uploadFile: uploadFileFn,
    renameObject,
    isFileTooSmall,
    getPublicUrl,
  };
}
