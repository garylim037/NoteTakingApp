import { getAllNotes, Note } from './noteStorage';

// ⚠️ 注意：等你的 Laravel 跑起来并且用了 ngrok 之后，把这个 URL 换成你的 ngrok 地址
const API_BASE_URL = 'http://10.0.2.2:8000/api'; // Android 模拟器访问本地宿主机的默认地址

export const CloudApi = {
  // Push local notes to the cloud
  syncToCloud: async (): Promise<boolean> => {
    try {
      // 1. 获取所有本地笔记 (调用队友写的接口)
      const localNotes = await getAllNotes();

      // 2. 发送请求到 Laravel 后端
      const response = await fetch(`${API_BASE_URL}/notes/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ notes: localNotes }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Cloud Sync Success:', result);
      return true;
    } catch (error) {
      console.error('Cloud Sync Failed:', error);
      return false;
    }
  }
};