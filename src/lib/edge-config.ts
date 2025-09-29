import { get } from '@vercel/edge-config';

export async function getShowCTFflag() {
  return await get('showCTFflag');
}
