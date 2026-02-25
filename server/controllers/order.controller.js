import prisma from '../config/db.js';

export const createOrder = async (req, res) => {
  try {
    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      customerAddress, 
      items, 
      total 
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !customerAddress || !items || !total) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create order in database with Cash on Delivery
    const order = await prisma.order.create({
      data: {
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        items,
        total: parseFloat(total),
        status: 'en_attente' // Cash on Delivery - payment pending
      }
    });

    res.status(201).json({
      order,
      message: 'Order placed successfully. Payment will be collected on delivery.'
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(orders);
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['en_attente', 'payée', 'expédiée'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const order = await prisma.order.update({
      where: { id },
      data: { status }
    });

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
