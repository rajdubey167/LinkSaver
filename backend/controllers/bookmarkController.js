const Bookmark = require('../models/Bookmark');
const fetchMeta = require('../utils/fetchMeta');

exports.addBookmark = async (req, res) => {
  try {
    const { url, tags, order } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'URL is required.' });
    }

    // Fetch metadata
    const { title, favicon, summary } = await fetchMeta(url);
    
    // Get highest order for new bookmark
    const highestOrder = await Bookmark.findOne({ user: req.user.userId })
      .sort('-order')
      .select('order');
    
    const bookmark = new Bookmark({
      user: req.user.userId,
      url,
      title,
      favicon,
      summary,
      tags: tags || [],
      order: order ?? (highestOrder?.order || 0) + 1,
    });
    
    await bookmark.save();
    res.status(201).json(bookmark);
  } catch (err) {
    console.error('Error adding bookmark:', err);
    res.status(500).json({ message: 'Failed to add bookmark. Please try again.' });
  }
};

exports.listBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.userId })
      .sort({ order: 1, createdAt: -1 })
      .lean()
      .exec();
    
    res.json(bookmarks);
  } catch (err) {
    console.error('Error listing bookmarks:', err);
    res.status(500).json({ message: 'Failed to fetch bookmarks. Please try again.' });
  }
};

exports.deleteBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Bookmark ID is required.' });
    }

    const result = await Bookmark.deleteOne({ _id: id, user: req.user.userId });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Bookmark not found.' });
    }
    
    res.json({ message: 'Bookmark deleted successfully.' });
  } catch (err) {
    console.error('Error deleting bookmark:', err);
    res.status(500).json({ message: 'Failed to delete bookmark. Please try again.' });
  }
};

exports.updateBookmark = async (req, res) => {
  try {
    const { id } = req.params;
    const update = req.body;
    
    if (!id) {
      return res.status(400).json({ message: 'Bookmark ID is required.' });
    }

    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: id, user: req.user.userId },
      update,
      { new: true, runValidators: true }
    );

    if (!bookmark) {
      return res.status(404).json({ message: 'Bookmark not found.' });
    }

    res.json(bookmark);
  } catch (err) {
    console.error('Error updating bookmark:', err);
    res.status(500).json({ message: 'Failed to update bookmark. Please try again.' });
  }
};

exports.reorderBookmarks = async (req, res) => {
  try {
    const { orders } = req.body;
    
    if (!Array.isArray(orders)) {
      return res.status(400).json({ message: 'Invalid order data.' });
    }

    const updates = orders.map(({ id, order }) => ({
      updateOne: {
        filter: { _id: id, user: req.user.userId },
        update: { $set: { order } }
      }
    }));

    await Bookmark.bulkWrite(updates);
    res.json({ message: 'Bookmarks reordered successfully.' });
  } catch (err) {
    console.error('Error reordering bookmarks:', err);
    res.status(500).json({ message: 'Failed to reorder bookmarks. Please try again.' });
  }
}; 