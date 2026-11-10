import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Product } from "../services/api/commerce";
type CartLine={product:Product;quantity:number};
type CommerceState={cart:CartLine[];wishlist:Product[];addToCart:(product:Product)=>void;changeQuantity:(productId:string,quantity:number)=>void;removeFromCart:(productId:string)=>void;toggleWishlist:(product:Product)=>void;clearCart:()=>void;};
export const useCommerceStore=create<CommerceState>()(persist((set)=>({
 cart:[],wishlist:[],
 addToCart:(product)=>set(state=>{const id=product.id||product._id||"";const stock=Math.max(0,Number(product.stock)||0);if(!id||stock<1)return{cart:state.cart};const existing=state.cart.find(line=>(line.product.id||line.product._id)===id);return{cart:existing?state.cart.map(line=>(line.product.id||line.product._id)===id?{...line,product,quantity:Math.min(20,stock,line.quantity+1)}:line):[...state.cart,{product,quantity:1}]};}),
 changeQuantity:(productId,quantity)=>set(state=>({cart:state.cart.flatMap(line=>{if((line.product.id||line.product._id)!==productId)return[line];const stock=Math.max(0,Number(line.product.stock)||0);const next=Math.min(20,stock,quantity);return next>0?[{...line,quantity:next}]:[];})})),
 removeFromCart:(productId)=>set(state=>({cart:state.cart.filter(line=>(line.product.id||line.product._id)!==productId)})),
 toggleWishlist:(product)=>set(state=>{const id=product.id||product._id;const exists=state.wishlist.some(item=>(item.id||item._id)===id);return{wishlist:exists?state.wishlist.filter(item=>(item.id||item._id)!==id):[...state.wishlist,product]};}),
 clearCart:()=>set({cart:[]}),
}),{name:"renewx-commerce-v1",storage:createJSONStorage(()=>AsyncStorage)}));
