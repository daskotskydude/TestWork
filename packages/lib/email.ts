/**
 * Email notification service using Resend
 * For MVP, this is a simple wrapper that can be enhanced later
 */

interface EmailOptions {
  to: string
  subject: string
  html: string
}

/**
 * Send email notification
 * In production, this should use Resend API or similar service
 * For MVP, we'll log emails to console
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  // In production, use Resend or another email service:
  // const response = await fetch('https://api.resend.com/emails', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     from: 'ProcureLink <notifications@procurelink.app>',
  //     to: options.to,
  //     subject: options.subject,
  //     html: options.html
  //   })
  // })

  // For MVP: Log to console
  console.log('📧 Email Notification:', {
    to: options.to,
    subject: options.subject,
    preview: options.html.substring(0, 100) + '...'
  })
}

/**
 * Email templates
 */

export const emailTemplates = {
  /**
   * Notify buyer when a new quote is received
   */
  newQuote: (buyerName: string, rfqTitle: string, supplierName: string, quoteAmount: string) => ({
    subject: `New Quote Received for "${rfqTitle}"`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Quote Received</h2>
        <p>Hi ${buyerName},</p>
        <p>You have received a new quote for your RFQ: <strong>${rfqTitle}</strong></p>
        <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Supplier:</strong> ${supplierName}</p>
          <p><strong>Quote Amount:</strong> ${quoteAmount}</p>
        </div>
        <p>
          <a href="http://localhost:3000/buyer/rfqs" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Quote
          </a>
        </p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
          ProcureLink - Your Procurement Partner
        </p>
      </div>
    `
  }),

  /**
   * Notify supplier when their quote is accepted
   */
  quoteAccepted: (supplierName: string, rfqTitle: string, poNumber: string, amount: string) => ({
    subject: `Quote Accepted - PO ${poNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">🎉 Quote Accepted!</h2>
        <p>Hi ${supplierName},</p>
        <p>Congratulations! Your quote has been accepted.</p>
        <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0; border: 2px solid #16a34a;">
          <p><strong>RFQ:</strong> ${rfqTitle}</p>
          <p><strong>PO Number:</strong> ${poNumber}</p>
          <p><strong>Order Amount:</strong> ${amount}</p>
        </div>
        <p>Please prepare the order and mark it as fulfilled once ready.</p>
        <p>
          <a href="http://localhost:3000/supplier/orders" style="background: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Order
          </a>
        </p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
          ProcureLink - Your Procurement Partner
        </p>
      </div>
    `
  }),

  /**
   * Notify buyer when order is fulfilled
   */
  orderFulfilled: (buyerName: string, poNumber: string, supplierName: string) => ({
    subject: `Order Fulfilled - PO ${poNumber}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">✅ Order Fulfilled</h2>
        <p>Hi ${buyerName},</p>
        <p>Your order has been fulfilled and is ready for delivery.</p>
        <div style="background: #f0fdf4; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>PO Number:</strong> ${poNumber}</p>
          <p><strong>Supplier:</strong> ${supplierName}</p>
        </div>
        <p>
          <a href="http://localhost:3000/buyer/orders" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View Order
          </a>
        </p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
          ProcureLink - Your Procurement Partner
        </p>
      </div>
    `
  }),

  /**
   * Notify supplier of new RFQ matching their category
   */
  newRFQ: (supplierName: string, rfqTitle: string, category: string, budget: string) => ({
    subject: `New RFQ Opportunity: ${rfqTitle}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New RFQ Opportunity</h2>
        <p>Hi ${supplierName},</p>
        <p>A new RFQ has been posted that matches your business category.</p>
        <div style="background: #eff6ff; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p><strong>Title:</strong> ${rfqTitle}</p>
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Budget:</strong> ${budget}</p>
        </div>
        <p>Submit your quote before others!</p>
        <p>
          <a href="http://localhost:3000/supplier/rfqs" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            View RFQ
          </a>
        </p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 24px;">
          ProcureLink - Your Procurement Partner
        </p>
      </div>
    `
  })
}
