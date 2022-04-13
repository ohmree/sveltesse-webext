import { webExtStores, storageMV2 } from 'svelte-webext-stores';
const stores = webExtStores(storageMV2('local'));

export const storageDemo = stores.addSyncStore('webext-demo', 'Storage Demo');
