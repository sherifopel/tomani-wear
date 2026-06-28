import { defineField, defineType } from 'sanity'
import { ShoppingCart } from 'lucide-react'

export const order = defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  icon: ShoppingCart,
  // Orders are read-only in Studio — created via the API, never manually
  fields: [
    defineField({
      name: 'orderNumber',
      title: 'Order Number',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Paid',      value: 'paid'      },
          { title: 'Fulfilled', value: 'fulfilled'  },
          { title: 'Refunded',  value: 'refunded'   },
        ],
      },
      initialValue: 'paid',
    }),
    defineField({
      name: 'paystackReference',
      title: 'Paystack Reference',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Amount (₦)',
      type: 'number',
      readOnly: true,
    }),
    defineField({
      name: 'paidAt',
      title: 'Paid At',
      type: 'datetime',
      readOnly: true,
    }),
    // ── Customer ──────────────────────────────────────────────────────────────
    defineField({
      name: 'customerName',
      title: 'Full Name',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'customerEmail',
      title: 'Email',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'customerPhone',
      title: 'Phone',
      type: 'string',
      readOnly: true,
    }),
    // ── Delivery address ──────────────────────────────────────────────────────
    defineField({
      name: 'address',
      title: 'Street Address',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'state',
      title: 'State',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      readOnly: true,
    }),
    // ── Items ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      readOnly: true,
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'productId', type: 'string', title: 'Product ID' }),
          defineField({ name: 'name',      type: 'string', title: 'Name'       }),
          defineField({ name: 'size',      type: 'string', title: 'Size'       }),
          defineField({ name: 'quantity',  type: 'number', title: 'Quantity'   }),
          defineField({ name: 'price',     type: 'number', title: 'Price (₦)'  }),
          defineField({ name: 'image',     type: 'string', title: 'Image URL'  }),
        ],
        preview: {
          select: { title: 'name', subtitle: 'size', quantity: 'quantity' },
          prepare({ title, subtitle, quantity }) {
            return { title: `${title} (${subtitle})`, subtitle: `Qty: ${quantity}` }
          },
        },
      }],
    }),
  ],
  preview: {
    select: {
      orderNumber: 'orderNumber',
      name: 'customerName',
      amount: 'totalAmount',
      status: 'status',
    },
    prepare({ orderNumber, name, amount, status }) {
      return {
        title: `${orderNumber} — ${name ?? 'Unknown'}`,
        subtitle: `₦${Number(amount).toLocaleString()} · ${status ?? 'paid'}`,
      }
    },
  },
  orderings: [{
    title: 'Newest First',
    name: 'paidAtDesc',
    by: [{ field: 'paidAt', direction: 'desc' }],
  }],
})
