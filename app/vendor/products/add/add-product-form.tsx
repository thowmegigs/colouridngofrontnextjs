"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { X, Plus, Upload, Trash2 } from "lucide-react"

interface Variant {
  id: string
  name: string
  price: string
  stock: string
  sku: string
  images: string[]
}

interface VariantOption {
  name: string
  values: string[]
}

export default function AddProductForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"basic" | "variants" | "images" | "seo">("basic")
  const [hasVariants, setHasVariants] = useState(false)
  const [variantOptions, setVariantOptions] = useState<VariantOption[]>([
    { name: "Color", values: ["Red", "Blue", "Green"] },
    { name: "Size", values: ["S", "M", "L"] },
  ])
  const [variants, setVariants] = useState<Variant[]>([
    {
      id: "1",
      name: "Red / S",
      price: "29.99",
      stock: "10",
      sku: "PROD-RED-S",
      images: ["/placeholder.svg?height=100&width=100"],
    },
    {
      id: "2",
      name: "Red / M",
      price: "29.99",
      stock: "15",
      sku: "PROD-RED-M",
      images: ["/placeholder.svg?height=100&width=100"],
    },
    {
      id: "3",
      name: "Blue / S",
      price: "29.99",
      stock: "8",
      sku: "PROD-BLUE-S",
      images: ["/placeholder.svg?height=100&width=100"],
    },
  ])

  const [productImages, setProductImages] = useState<string[]>([
    "/placeholder.svg?height=200&width=200",
    "/placeholder.svg?height=200&width=200",
  ])

  const [productName, setProductName] = useState("")
  const [productSku, setProductSku] = useState("")
  const [productDescription, setProductDescription] = useState("")
  const [productPrice, setProductPrice] = useState("")
  const [productComparePrice, setProductComparePrice] = useState("")
  const [productStock, setProductStock] = useState("")
  const [productCategory, setProductCategory] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [urlHandle, setUrlHandle] = useState("")

  const addVariantOption = () => {
    setVariantOptions([...variantOptions, { name: "", values: [""] }])
  }

  const updateVariantOptionName = (index: number, name: string) => {
    const newOptions = [...variantOptions]
    newOptions[index].name = name
    setVariantOptions(newOptions)
  }

  const addVariantValue = (optionIndex: number) => {
    const newOptions = [...variantOptions]
    newOptions[optionIndex].values.push("")
    setVariantOptions(newOptions)
  }

  const updateVariantValue = (optionIndex: number, valueIndex: number, value: string) => {
    const newOptions = [...variantOptions]
    newOptions[optionIndex].values[valueIndex] = value
    setVariantOptions(newOptions)
  }

  const removeVariantValue = (optionIndex: number, valueIndex: number) => {
    const newOptions = [...variantOptions]
    newOptions[optionIndex].values.splice(valueIndex, 1)
    setVariantOptions(newOptions)
  }

  const removeVariantOption = (index: number) => {
    const newOptions = [...variantOptions]
    newOptions.splice(index, 1)
    setVariantOptions(newOptions)
  }

  const addProductImage = () => {
    setProductImages([...productImages, "/placeholder.svg?height=200&width=200"])
  }

  const removeProductImage = (index: number) => {
    const newImages = [...productImages]
    newImages.splice(index, 1)
    setProductImages(newImages)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    router.push("/vendor/products")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-4 py-2 text-sm bg-pink-600 text-white rounded-md hover:bg-pink-700"
          >
            Save Product
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("basic")}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === "basic"
                  ? "border-b-2 border-pink-500 text-pink-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Basic Information
            </button>
            <button
              onClick={() => setActiveTab("variants")}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === "variants"
                  ? "border-b-2 border-pink-500 text-pink-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Variants
            </button>
            <button
              onClick={() => setActiveTab("images")}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === "images"
                  ? "border-b-2 border-pink-500 text-pink-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Images
            </button>
            <button
              onClick={() => setActiveTab("seo")}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === "seo"
                  ? "border-b-2 border-pink-500 text-pink-600"
                  : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              SEO
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Basic Information Tab */}
          {activeTab === "basic" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name*
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                    SKU (Stock Keeping Unit)*
                  </label>
                  <input
                    type="text"
                    id="sku"
                    value={productSku}
                    onChange={(e) => setProductSku(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="Enter product SKU"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description*
                </label>
                <textarea
                  id="description"
                  rows={5}
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter product description"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price*
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      id="price"
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="comparePrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Compare at Price
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <input
                      type="text"
                      id="comparePrice"
                      value={productComparePrice}
                      onChange={(e) => setProductComparePrice(e.target.value)}
                      className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity*
                  </label>
                  <input
                    type="number"
                    id="stock"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category*
                </label>
                <select
                  id="category"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="">Select a category</option>
                  <option value="electronics">Electronics</option>
                  <option value="clothing">Clothing</option>
                  <option value="home">Home & Kitchen</option>
                  <option value="beauty">Beauty & Personal Care</option>
                  <option value="sports">Sports & Outdoors</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  id="hasVariants"
                  type="checkbox"
                  checked={hasVariants}
                  onChange={() => setHasVariants(!hasVariants)}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="hasVariants" className="ml-2 block text-sm text-gray-700">
                  This product has multiple options, like different sizes or colors
                </label>
              </div>
            </div>
          )}

          {/* Variants Tab */}
          {activeTab === "variants" && (
            <div className="space-y-6">
              {!hasVariants ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    This product doesn&apos;t have variants. Enable variants in the Basic Information tab.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Variant Options</h3>

                    {variantOptions.map((option, optionIndex) => (
                      <div key={optionIndex} className="bg-gray-50 p-4 rounded-md">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex-1 mr-4">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Option Name</label>
                            <input
                              type="text"
                              value={option.name}
                              onChange={(e) => updateVariantOptionName(optionIndex, e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                              placeholder="Color, Size, Material, etc."
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeVariantOption(optionIndex)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <X size={20} />
                          </button>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">Option Values</label>

                          {option.values.map((value, valueIndex) => (
                            <div key={valueIndex} className="flex items-center">
                              <input
                                type="text"
                                value={value}
                                onChange={(e) => updateVariantValue(optionIndex, valueIndex, e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                placeholder="Enter option value"
                              />
                              <button
                                type="button"
                                onClick={() => removeVariantValue(optionIndex, valueIndex)}
                                className="ml-2 text-gray-400 hover:text-gray-500"
                              >
                                <X size={20} />
                              </button>
                            </div>
                          ))}

                          <button
                            type="button"
                            onClick={() => addVariantValue(optionIndex)}
                            className="mt-2 flex items-center text-sm text-pink-600 hover:text-pink-700"
                          >
                            <Plus size={16} className="mr-1" />
                            Add another value
                          </button>
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={addVariantOption}
                      className="flex items-center text-sm text-pink-600 hover:text-pink-700"
                    >
                      <Plus size={16} className="mr-1" />
                      Add another option
                    </button>
                  </div>

                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Variants</h3>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Variant
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Price
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Stock
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              SKU
                            </th>
                            <th
                              scope="col"
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              Images
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {variants.map((variant) => (
                            <tr key={variant.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {variant.name}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="relative">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-500 sm:text-sm">$</span>
                                  </div>
                                  <input
                                    type="text"
                                    value={variant.price}
                                    onChange={(e) => {
                                      const newVariants = [...variants]
                                      newVariants.find((v) => v.id === variant.id)!.price = e.target.value
                                      setVariants(newVariants)
                                    }}
                                    className="w-24 pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <input
                                  type="text"
                                  value={variant.stock}
                                  onChange={(e) => {
                                    const newVariants = [...variants]
                                    newVariants.find((v) => v.id === variant.id)!.stock = e.target.value
                                    setVariants(newVariants)
                                  }}
                                  className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <input
                                  type="text"
                                  value={variant.sku}
                                  onChange={(e) => {
                                    const newVariants = [...variants]
                                    newVariants.find((v) => v.id === variant.id)!.sku = e.target.value
                                    setVariants(newVariants)
                                  }}
                                  className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                                />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center space-x-2">
                                  {variant.images.map((image, index) => (
                                    <div key={index} className="relative h-10 w-10">
                                      <img
                                        src={image || "/placeholder.svg"}
                                        alt={`Variant ${variant.name} image ${index + 1}`}
                                        className="h-10 w-10 rounded-md object-cover"
                                      />
                                    </div>
                                  ))}
                                  <button
                                    type="button"
                                    className="h-10 w-10 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-500"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Images Tab */}
          {activeTab === "images" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Product Images</h3>
              <p className="text-sm text-gray-500">Add images to showcase your product. You can add up to 8 images.</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {productImages.map((image, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Product image ${index + 1}`}
                        className="h-full w-full object-cover object-center"
                      />
                      <button
                        type="button"
                        onClick={() => removeProductImage(index)}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-sm hover:bg-gray-100"
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}

                {productImages.length < 8 && (
                  <button
                    type="button"
                    onClick={addProductImage}
                    className="border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center p-6 text-gray-500 hover:text-gray-700 hover:border-gray-400"
                  >
                    <Upload size={24} className="mb-2" />
                    <span className="text-sm">Add Image</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SEO Tab */}
          {activeTab === "seo" && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Search Engine Optimization</h3>
              <p className="text-sm text-gray-500">
                Add SEO information to help customers find your product in search engines.
              </p>

              <div>
                <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Title
                </label>
                <input
                  type="text"
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter meta title"
                />
                <p className="mt-1 text-sm text-gray-500">Recommended length: 50-60 characters</p>
              </div>

              <div>
                <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-1">
                  Meta Description
                </label>
                <textarea
                  id="metaDescription"
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter meta description"
                ></textarea>
                <p className="mt-1 text-sm text-gray-500">Recommended length: 150-160 characters</p>
              </div>

              <div>
                <label htmlFor="urlHandle" className="block text-sm font-medium text-gray-700 mb-1">
                  URL Handle
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                    yourstore.com/product/
                  </span>
                  <input
                    type="text"
                    id="urlHandle"
                    value={urlHandle}
                    onChange={(e) => setUrlHandle(e.target.value)}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    placeholder="product-url-handle"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
