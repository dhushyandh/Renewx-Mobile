import { useWindowDimensions } from 'react-native';
export function useResponsive(){ const {width,height}=useWindowDimensions(); return {width,height,isCompact:width<600,isTablet:width>=600&&width<1024,isDesktop:width>=1024,contentMaxWidth:1200}; }
