import prisma from '../config/db.js';

export const getProducts = async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id }
    });
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, colors, sizes, stock, images, packagingImage, videoUrl } = req.body;
    
    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(price),
        category,
        colors: colors || ['argent', 'doré'],
        sizes: sizes || [],
        stock: parseInt(stock) || 0,
        images: images || [],
        packagingImage: packagingImage || '',
        videoUrl: videoUrl || ''
      }
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, colors, sizes, stock, images, packagingImage, videoUrl } = req.body;
    
    // Construire l'objet de données uniquement avec les champs fournis
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description || '';
    if (price !== undefined) updateData.price = parseFloat(price);
    if (category !== undefined) updateData.category = category;
    if (colors !== undefined) updateData.colors = colors || ['argent', 'doré'];
    if (sizes !== undefined) updateData.sizes = sizes || [];
    if (stock !== undefined) updateData.stock = parseInt(stock) || 0;
    if (images !== undefined) updateData.images = images || [];
    if (packagingImage !== undefined) updateData.packagingImage = packagingImage;
    if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
    
    updateData.updatedAt = new Date();
    
    const product = await prisma.product.update({
      where: { id },
      data: updateData
    });
    
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.product.delete({
      where: { id }
    });
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
