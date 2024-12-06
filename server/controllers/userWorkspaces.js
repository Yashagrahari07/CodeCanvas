import User from '../models/User.js';

// Fetch all workspaces for a user by user ID
export const getUserWorkspaces = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.ws);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const addUserWorkspace = async (req, res) => {
  try {
    const userId = req.params.id;
    const newWorkspace = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.ws.push(newWorkspace);
    await user.save();
    res.status(201).json(user.ws);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
export const deleteWorkspace = async (req, res) => {
  const { id, wsId} = req.params;
  //console.log(id,wsId)
  try {
      const user = await User.findById(id);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }
      user.ws = user.ws.filter(workspace => workspace._id.toString() !== wsId);
      await user.save();
      res.status(200).json({ message: 'Workspace deleted successfully' });
  } catch (error) {
      res.status(500).json({ message: 'Failed to delete workspace', error });
  }
};
export const updateWorkspaceName = async (req, res) => {
  const { id, wsId } = req.params;
  const { title } = req.body;

  try {
      const user = await User.findById(id);
      const workspace = user.ws.id(wsId);
      
      if (!workspace) {
          return res.status(404).json({ message: "Workspace not found" });
      }
      
      workspace.title = title;
      await user.save();
      
      res.status(200).json(workspace);
  } catch (error) {
      res.status(500).json({ message: "Something went wrong", error });
  }
};
export const addCardToWorkspace = async (req, res) => {
  const { id, wsId } = req.params;
  const { title, language } = req.body;

  try {
      const user = await User.findById(id);

      if (!user) return res.status(404).json({ message: "User not found" });

      const workspace = user.ws.id(wsId);
      if (!workspace) return res.status(404).json({ message: "Workspace not found" });
      
      const newCard = {language };
      if (title) {
        newCard.title = title;
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
  const { newTitle } = req.body;

  try {
      const user = await User.findById(id);
      if (!user) return res.status(404).send('User not found');

      const workspace = user.ws.id(wsId);
      if (!workspace) return res.status(404).send('Workspace not found');

      const card = workspace.cards.id(cardId);
      if (!card) return res.status(404).send('Card not found');

      card.title = newTitle;

      await user.save();
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
export const deleteCardFromWorkspace = async (req, res) => {
  const { id, wsId, cardId } = req.params;

  try {
      const user = await User.findById(id);
      if (!user) return res.status(404).send('User not found');

      const workspace = user.ws.id(wsId);
      if (!workspace) return res.status(404).send('Workspace not found');

      const card = workspace.cards.id(cardId);
      if (!card) return res.status(404).send('Card not found');

      workspace.cards.pull(cardId);

      await user.save();
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

export const getCardDetails = async (req, res) => {
  const { id, wsId, cardId } = req.params;

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
  const { newCode } = req.body;
  //console.log(id,wsId,cardId,newCode);
  try {
      const user = await User.findById(id);
      if (!user) return res.status(404).send('User not found');

      const workspace = user.ws.id(wsId);
      if (!workspace) return res.status(404).send('Workspace not found');

      const card = workspace.cards.id(cardId);
      if (!card) return res.status(404).send('Card not found');

      card.code = newCode;

      await user.save();
      res.status(200).json(user);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
  
};
export default getUserWorkspaces;