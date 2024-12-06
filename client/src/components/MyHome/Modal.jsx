import React, { useRef, useState, useEffect } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { FcOk } from 'react-icons/fc';
import {getData,addData,updateWorkspaceName,addCardToWorkspace,updateCardName} from '../../api/api';


const Model = ({ openModal, setOpenModal, wsId, cardId, getLists }) => {
  const user=JSON.parse(localStorage.getItem('profile'));
  const userId=user?.result?._id;
  const [msg, setMsg] = useState('');
  const [enteredVal, setEnteredVal] = useState('');
  const [enteredLang,setLang]=useState('');
  const [folders,setFolders]=useState([]);

  const inputRef = useRef(null);

  const handleChange = (event, field) => {
    if (field === 'title') {
      setEnteredVal(event.target.value);
    } else if (field === 'language') {
      setLang(event.target.value);
    }
  };


  useEffect(()=>{   
    const getList=async()=>{
      const list=await getData(userId);
      //console.log(list.data);
      setFolders(list.data);
    }
    getList();
  },[])

  const addFolder = async(folderName) => { 
    //console.log(folderName);
    const newState= {
      title: folderName,
      cards: []
    }
    //console.log(newState);
    const res=await addData(userId,newState);
    getLists();   
  }
  const updateFolder=async(wsId, enteredVal)=>{
    //console.log(userId,wsId,enteredVal);
    await updateWorkspaceName(userId, wsId, enteredVal);
    getLists();
  }

  const addCard = async (wsId, cardTitle, cardLanguage) => {
    const newCard = {
        title: cardTitle,
          language: cardLanguage
      };
      console.log(newCard,userId,wsId);
      await addCardToWorkspace(userId, wsId, newCard);
      getLists();
  };
  
  const editCardname=async(wsId, cardId, enteredVal)=>{
    //console.log(wsId,cardId,enteredVal)
    const res=await updateCardName(userId, wsId, cardId, enteredVal)
    console.log(res);
    getLists();
  }

  const handleSubmit = () => {
    const m = openModal;
    switch (m) {
      case 1:
        // console.log('Enter Foldername',enteredVal);
        addFolder(enteredVal);
        break;
      case 2:
        // console.log('Enter Workspace name',enteredVal,enteredLang);
        addCard(wsId,enteredVal,enteredLang);
        break;
      case 3:
        updateFolder(wsId, enteredVal);
        break;
      case 4:
        // console.log('Workspace name',enteredVal);
        editCardname(wsId,cardId,enteredVal)
        break;
      default:
        console.log('');
        break;
    }
    setOpenModal({ state: false });
  };

  useEffect(() => {
    const m = openModal;
    //console.log(m);
    switch (m) {
      case 1:
        setMsg('Enter Foldername');
        break;
      case 2:
        setMsg('Enter Workspace name');
        break;
      case 3:
        setMsg('Edit Foldername');
        break;
      case 4:
        setMsg('Edit Workspace name');
        break;
      default:
        setMsg('');
        break;
    }
  }, [openModal]);

  return (
    <div className='modal-container'>
      <div className='modal-content'>
        <div className='m-header'>
          <h3>{msg}</h3>
          <button className='close-button' onClick={() => setOpenModal({ state: false })}>
            <IoCloseSharp />
          </button>
        </div>
        <div className='input-container'>
          <input
            className='input'
            placeholder='title'
            type="text"
            ref={inputRef}
            value={enteredVal}
            onChange={(event) => handleChange(event, 'title')}
          />
          {openModal==2 && (
            <select
           
            ref={inputRef}
            value={enteredLang}
            onChange={(event) => handleChange(event, 'language')}
          >
            <option value="" disabled>Select language</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="c++">C++</option>
          </select>
          )}
  

          <FcOk style={{ height: '4vh', width: '4vh', cursor: 'pointer' }} onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Model;
