import {PRODUCTS_URL,UPLOAD_URL} from "../constants";
import { apiSlice } from "./apiSlice";



export const productApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getProducts : builder.query({
            query:()=>({
                url:PRODUCTS_URL,
            }),
            providesTags:["Products"],
            keepUnusedDataFor:5
        }),
        getProductDetails : builder.query({
            query:(id)=>({
                url:`${PRODUCTS_URL}/${id}`,
            }),
            keepUnusedDataFor:5
        }),
        createProduct: builder.mutation({
            query:()=>({
                url :PRODUCTS_URL,
                method:"POST",
            }),
            invalidatesTags:["Product"]
        }),
        updateProduct:builder.mutation({
            query: (data)=>({
                url: `${PRODUCTS_URL}/${data._id}`,
                method:"PUT",
                body:data,
            }),
            invalidatesTags:["Products"]

        }),
        uploadProductImage:builder.mutation({
            query:(data)=>({
                url:UPLOAD_URL,
                method:"POST",
                body:data,
            })
        })
    })
})

export const {useGetProductsQuery,useUploadProductImageMutation,useUpdateProductMutation,useCreateProductMutation,useGetProductDetailsQuery} = productApiSlice;