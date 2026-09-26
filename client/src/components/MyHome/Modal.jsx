import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { addData, updateWorkspaceName, addCardToWorkspace, updateCardName } from '../../api/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FolderPlus, FilePlus, Edit2, Code2 } from 'lucide-react';

const Modal = ({ openModal, setOpenModal, wsId, cardId, getLists }) => {
  const user = JSON.parse(localStorage.getItem('profile'));
  const userId = user?.result?._id;
  const [msg, setMsg] = useState('');
  const [enteredVal, setEnteredVal] = useState('');
  const [enteredLang, setLang] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const addFolder = async (folderName) => {
    const newState = {
      title: folderName,
      cards: []
    };
    await addData(userId, newState);
    await getLists();
  };

  const updateFolder = async (wsId, enteredVal) => {
    await updateWorkspaceName(userId, wsId, enteredVal);
    await getLists();
  };

  const addCard = async (wsId, cardTitle, cardLanguage) => {
    const newCard = {
      title: cardTitle,
      language: cardLanguage
    };
    await addCardToWorkspace(userId, wsId, newCard);
    await getLists();
  };
  
  const editCardname = async (wsId, cardId, enteredVal) => {
    await updateCardName(userId, wsId, cardId, enteredVal);
    await getLists();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!enteredVal.trim()) {
      toast.error('Please enter a title');
      return;
    }
    if (openModal === 2 && !enteredLang) {
      toast.error('Please select a programming language');
      return;
    }

    setSubmitting(true);
    const m = openModal;
    try {
      switch (m) {
        case 1: await addFolder(enteredVal); break;
        case 2: await addCard(wsId, enteredVal, enteredLang); break;
        case 3: await updateFolder(wsId, enteredVal); break;
        case 4: await editCardname(wsId, cardId, enteredVal); break;
        default: return;
      }
      toast.success(
        m === 1 ? 'Folder created!' :
        m === 2 ? 'File created!' :
        m === 3 ? 'Folder renamed!' : 'File renamed!'
      );
      setOpenModal({ state: false });
    } catch (error) {
      const message = error?.response?.data?.message || 'Could not save changes';
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const m = openModal;
    switch (m) {
      case 1:
        setMsg('Create New Folder');
        break;
      case 2:
        setMsg('Create New File');
        break;
      case 3:
        setMsg('Rename Folder');
        break;
      case 4:
        setMsg('Rename File');
        break;
      default:
        setMsg('');
        break;
    }
  }, [openModal]);

  const getIcon = () => {
    switch (openModal) {
      case 1: return <FolderPlus className="h-5 w-5 text-[#55a940]" />;
      case 2: return <FilePlus className="h-5 w-5 text-[#55a940]" />;
      case 3: return <Edit2 className="h-5 w-5 text-[#55a940]" />;
      case 4: return <Edit2 className="h-5 w-5 text-[#55a940]" />;
      default: return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && setOpenModal({ state: false })}>
      <DialogContent className="bg-[#2b2a2a] text-[#e2e3e2] border-2 border-[#8ab180]/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-white">
            {getIcon()}
            {msg}
          </DialogTitle>
          <DialogDescription className="text-[#bbccb7]">
            {openModal === 1 && "Create a new workspace folder to group your code files."}
            {openModal === 2 && "Add a new code file to your selected workspace."}
            {openModal === 3 && "Enter a new name for this folder."}
            {openModal === 4 && "Enter a new title for this file."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-[#e2e3e2]">
              {openModal === 1 || openModal === 3 ? "Folder Title" : "File Title"}
            </Label>
            <Input
              id="title"
              placeholder={openModal === 1 || openModal === 3 ? "e.g. Web Algorithms" : "e.g. solution.cpp"}
              type="text"
              value={enteredVal}
              onChange={(e) => setEnteredVal(e.target.value)}
              autoFocus
              className="bg-[#323232] border-[#8ab180]/30 text-white placeholder:text-gray-400 focus:border-[#55a940]"
            />
          </div>

          {openModal === 2 && (
            <div className="space-y-2">
              <Label htmlFor="language" className="text-sm font-medium text-[#e2e3e2]">
                Programming Language
              </Label>
              <Select value={enteredLang} onValueChange={(val) => setLang(val)}>
                <SelectTrigger className="bg-[#323232] border-[#8ab180]/30 text-white focus:border-[#55a940]">
                  <SelectValue placeholder="Select language..." />
                </SelectTrigger>
                <SelectContent className="bg-[#2b2a2a] border-[#8ab180]/30 text-[#e2e3e2]">
                  <SelectItem value="javascript">JavaScript (Node.js)</SelectItem>
                  <SelectItem value="python">Python 3</SelectItem>
                  <SelectItem value="cpp">C++ (GCC)</SelectItem>
                  <SelectItem value="java">Java</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="pt-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpenModal({ state: false })}
              className="border-[#8ab180]/30 bg-[#323232] text-[#e2e3e2] hover:bg-[#323232]/80"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="bg-[#55a940] hover:bg-[#61ab4e] text-white font-bold"
            >
              {submitting ? 'Saving...' : 'Confirm'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;

