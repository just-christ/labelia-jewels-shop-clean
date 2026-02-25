import prisma from '../config/db.js';

export const getCustomers = async (req, res) => {
  try {
    // Get unique customers from orders
    const orders = await prisma.order.findMany({
      select: {
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        customerAddress: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Group by email to get unique customers
    const uniqueCustomers = [];
    const seenEmails = new Set();

    for (const order of orders) {
      if (!seenEmails.has(order.customerEmail)) {
        seenEmails.add(order.customerEmail);
        uniqueCustomers.push({
          name: order.customerName,
          email: order.customerEmail,
          phone: order.customerPhone,
          address: order.customerAddress,
          firstOrderDate: order.createdAt
        });
      }
    }

    res.json(uniqueCustomers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
