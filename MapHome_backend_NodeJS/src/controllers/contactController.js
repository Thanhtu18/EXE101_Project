const Contact = require('../models/Contact');

// Submit a contact message
exports.submitContact = async (req, res) => {
  try {
    const newMessage = new Contact(req.body);
    const savedMessage = await newMessage.save();
    res.status(201).json({ message: 'Message sent successfully', data: savedMessage });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all messages (Admin only)
exports.getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a message (Admin only)
exports.deleteMessage = async (req, res) => {
  try {
    const deletedMessage = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedMessage) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Reply to a message (mark as responded) (Admin only)
exports.replyContact = async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: 'responded' },
      { new: true }
    );
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message marked as responded', data: message });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
