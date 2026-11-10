import React from 'react';
import { SvgXml } from 'react-native-svg';
import { colors } from '../../src/theme';

const art = {
  phone: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect x="29" y="9" width="62" height="102" rx="13" fill="#111827"/><rect x="34" y="15" width="52" height="88" rx="8" fill="#F3F4F6"/><rect x="39" y="23" width="42" height="67" rx="5" fill="#FFC400"/><circle cx="60" cy="97" r="3" fill="#9CA3AF"/><path d="M47 48h26M47 56h18" stroke="#111827" stroke-width="3" stroke-linecap="round"/><circle cx="72" cy="35" r="5" fill="#fff" opacity=".8"/></svg>`,
  laptop: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect x="19" y="18" width="82" height="60" rx="7" fill="#111827"/><rect x="24" y="23" width="72" height="50" rx="3" fill="#F3F4F6"/><rect x="29" y="28" width="62" height="40" rx="2" fill="#FFC400"/><path d="M10 84h100l-8 10H18z" fill="#6B7280"/><path d="M48 85h24" stroke="#E5E7EB" stroke-width="2" stroke-linecap="round"/><circle cx="60" cy="48" r="10" fill="#fff" opacity=".75"/></svg>`,
  tablet: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect x="20" y="10" width="80" height="100" rx="11" fill="#111827"/><rect x="25" y="16" width="70" height="88" rx="6" fill="#FFC400"/><path d="M37 34h46M37 42h30" stroke="#111827" stroke-width="3" stroke-linecap="round"/><rect x="37" y="55" width="46" height="32" rx="5" fill="#fff" opacity=".7"/><circle cx="60" cy="98" r="2" fill="#9CA3AF"/></svg>`,
  accessories: `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><path d="M36 57V40a24 24 0 0 1 48 0v17" fill="none" stroke="#111827" stroke-width="9" stroke-linecap="round"/><rect x="25" y="52" width="22" height="35" rx="9" fill="#FFC400" stroke="#111827" stroke-width="4"/><rect x="73" y="52" width="22" height="35" rx="9" fill="#FFC400" stroke="#111827" stroke-width="4"/><path d="M84 88q-5 14-23 14" fill="none" stroke="#6B7280" stroke-width="4" stroke-linecap="round"/><circle cx="58" cy="102" r="5" fill="#111827"/></svg>`
};
type Kind = keyof typeof art;
export function CategoryArtwork({kind,size=76}:{kind:Kind;size?:number}) {
 return <SvgXml xml={art[kind]} width={size} height={size} />;
}
export function CategoryArtworkPreview(){return null;}
