import User from '../models/User.js';
import {
  isNonEmptyString,
  isValidObjectId,
  normalizeLanguage,
  supportedLanguages,
  validateCard,
  validateWorkspace,
} from '../utils/validation.js';

// Fetch all workspaces for a user by user ID
export const getUserWorkspaces = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) return res.status(400).json({ message: 'Invalid user ID' });
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.ws);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const addUserWorkspace = async (req, res) => {
  try {
    const userId = req.params.id;
    const newWorkspace = req.body;
    if (!isValidObjectId(userId) || !validateWorkspace(newWorkspace) || (newWorkspace.cards || []).some((card) => !validateCard(card))) {
      return res.status(400).json({ message: 'Invalid workspace data' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const normalizedWorkspace = {
      ...newWorkspace,
      cards: (newWorkspace.cards || []).map((card) => ({
        ...card,
        language: normalizeLanguage(card.language),
      })),
    };

    user.ws.push(normalizedWorkspace);
    await user.save();
    res.status(201).json(user.ws);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
export const deleteWorkspace = async (req, res) => {
  const { id, wsId} = req.params;
  if (!isValidObjectId(id) || !isValidObjectId(wsId)) return res.status(400).json({ message: 'Invalid workspace ID' });
  try {
      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      user.ws = user.ws.filter(workspace => workspace._id.toString() !== wsId);
      await user.save();
      res.status(200).json({ message: 'Workspace deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Failed to delete workspace' });
  }
};
export const updateWorkspaceName = async (req, res) => {
  const { id, wsId } = req.params;
  const { title } = req.body || {};
  if (!isValidObjectId(id) || !isValidObjectId(wsId) || !isNonEmptyString(title, 100)) {
      return res.status(400).json({ message: 'Invalid workspace title' });
  }

  try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });
      const workspace = user.ws.id(wsId);
      
      if (!workspace) {
          return res.status(404).json({ message: "Workspace not found" });
      }
      
      workspace.title = title;
      await user.save();
      
      res.status(200).json(workspace);
  } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
  }
};
export const addCardToWorkspace = async (req, res) => {
  const { id, wsId } = req.params;
  const { title, language } = req.body || {};
  const normalizedLanguage = normalizeLanguage(language);
  if (!isValidObjectId(id) || !isValidObjectId(wsId) || !supportedLanguages.has(normalizedLanguage) || (title !== undefined && !isNonEmptyString(title, 100))) {
      return res.status(400).json({ message: 'Invalid file data' });
  }

  try {
      const user = await User.findById(id);

      if (!user) return res.status(404).json({ message: "User not found" });

      const workspace = user.ws.id(wsId);
      if (!workspace) return res.status(404).json({ message: "Workspace not found" });
      
      const newCard = { language: normalizedLanguage };
      if (title) {
        newCard.title = title.trim();
      }
      workspace.cards.push(newCard);
      await user.save();

      res.status(200).json(workspace.cards);
  } catch (error) {
      res.status(409).json({ message: error.message });
  }
};
export const updateCardName = async (req, res) => {
  const { id, wsId, cardId } = req.params;
  const { newTitle } = req.body || {};
  if (!isValidObjectId(id) || !isValidObjectId(wsId) || !isValidObjectId(cardId) || !isNonEmptyString(newTitle, 100)) {
      return res.status(400).json({ message: 'Invalid file title' });
  }

  try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const workspace = user.ws.id(wsId);
      if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

      const card = workspace.cards.id(cardId);
      if (!card) return res.status(404).json({ message: 'File not found' });

      card.title = newTitle;

      await user.save();
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
export const deleteCardFromWorkspace = async (req, res) => {
  const { id, wsId, cardId } = req.params;
  if (!isValidObjectId(id) || !isValidObjectId(wsId) || !isValidObjectId(cardId)) {
      return res.status(400).json({ message: 'Invalid file ID' });
  }

  try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const workspace = user.ws.id(wsId);
      if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

      const card = workspace.cards.id(cardId);
      if (!card) return res.status(404).json({ message: 'File not found' });

      workspace.cards.pull(cardId);

      await user.save();
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const getCardDetails = async (req, res) => {
  const { id, wsId, cardId } = req.params;
  if (!isValidObjectId(id) || !isValidObjectId(wsId) || !isValidObjectId(cardId)) {
      return res.status(400).json({ message: 'Invalid file ID' });
  }

  try {
    const user = await User.findById(id);

    if (!user) return res.status(404).json({ message: 'User not found' });

    const workspace = user.ws.id(wsId);
    if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

    const card = workspace.cards.id(cardId);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    res.status(200).json(card);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCardCode = async (req, res) => {
  const { id, wsId, cardId } = req.params;
  const { newCode } = req.body || {};
  if (!isValidObjectId(id) || !isValidObjectId(wsId) || !isValidObjectId(cardId) || typeof newCode !== 'string' || newCode.length > 100000) {
      return res.status(400).json({ message: 'Invalid source code' });
  }
  try {
      const user = await User.findById(id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const workspace = user.ws.id(wsId);
      if (!workspace) return res.status(404).json({ message: 'Workspace not found' });

      const card = workspace.cards.id(cardId);
      if (!card) return res.status(404).json({ message: 'File not found' });

      card.code = newCode;

      await user.save();
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
  
};
export default getUserWorkspaces;