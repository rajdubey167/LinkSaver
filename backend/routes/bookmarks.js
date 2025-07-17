const express = require('express');
const router = express.Router();
const bookmarkController = require('../controllers/bookmarkController');
const requireAuth = require('../middleware/requireAuth'); // To be implemented

router.use(requireAuth);

router.post('/', bookmarkController.addBookmark);
router.get('/', bookmarkController.listBookmarks);
router.delete('/:id', bookmarkController.deleteBookmark);
router.put('/:id', bookmarkController.updateBookmark);
router.post('/reorder', bookmarkController.reorderBookmarks);

module.exports = router; 