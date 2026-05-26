import { defineStore } from 'pinia'

function buildSignature(item) {
  const includes = [...(item.include || [])].sort().join('|')
  const omits = [...(item.omit || [])].sort().join('|')
  return [item.dishId, item.style || '', includes, omits, item.notes || ''].join('::')
}

function toNumber(value) {
  return Number.parseFloat(Number(value || 0).toFixed(2))
}

export const useOrderStore = defineStore('order', {
  state: () => ({
    selectedCategoryId: 'food',
    selectedSubcategoryId: 'tacos',
    cart: [],
    couponCode: '',
    appliedCoupon: ''
  }),
  getters: {
    cartCount: (state) => state.cart.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: (state) =>
      toNumber(state.cart.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)),
    discountAmount() {
      if (this.appliedCoupon === 'TACO10') {
        return toNumber(this.subtotal * 0.1)
      }

      if (this.appliedCoupon === 'MESA20') {
        return toNumber(Math.min(20, this.subtotal * 0.08))
      }

      return 0
    },
    total() {
      return toNumber(Math.max(0, this.subtotal - this.discountAmount))
    }
  },
  actions: {
    setCategory(categoryId) {
      this.selectedCategoryId = categoryId
    },
    setSubcategory(subcategoryId) {
      this.selectedSubcategoryId = subcategoryId
    },
    setCouponCode(value) {
      this.couponCode = value
    },
    applyCoupon() {
      this.appliedCoupon = this.couponCode.trim().toUpperCase()
    },
    clearCoupon() {
      this.couponCode = ''
      this.appliedCoupon = ''
    },
    addItem(item) {
      const signature = buildSignature(item)
      const existing = this.cart.find((cartItem) => cartItem.signature === signature)

      if (existing) {
        existing.quantity += item.quantity
        existing.lineTotal = toNumber(existing.quantity * existing.unitPrice)
        return
      }

      this.cart.push({
        id: `${item.dishId}-${Date.now()}`,
        signature,
        dishId: item.dishId,
        name: item.name,
        imageTone: item.imageTone,
        priceLabel: item.priceLabel,
        unitPrice: toNumber(item.unitPrice),
        quantity: item.quantity,
        include: [...(item.include || [])],
        omit: [...(item.omit || [])],
        style: item.style,
        notes: item.notes || '',
        lineTotal: toNumber(item.quantity * item.unitPrice)
      })
    },
    updateQuantity(id, quantity) {
      const target = this.cart.find((item) => item.id === id)
      if (!target) return

      target.quantity = Math.max(1, quantity)
      target.lineTotal = toNumber(target.quantity * target.unitPrice)
    },
    removeItem(id) {
      this.cart = this.cart.filter((item) => item.id !== id)
    },
    clearCart() {
      this.cart = []
      this.clearCoupon()
    }
  }
})