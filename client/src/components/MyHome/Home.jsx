import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './styles.css';
import { IoTrashOutline } from 'react-icons/io5'
import { BiEditAlt } from 'react-icons/bi'
import { FcOpenedFolder } from 'react-icons/fc'
import logo from '../../assets/logoCode.png';
import Modal from './Modal';
import Navbar from '../Navbar/Navbar';
import {getData,deleteWorkspace,deleteCardFromWorkspace} from '../../api/api';
import { toast } from 'react-hot-toast';

const Home = () => {
    const navigate=useNavigate();
    const [openModal, setOpenModal] = useState({ state: false});
    const user=JSON.parse(localStorage.getItem('profile'));

    useEffect(()=>{
      if(!user) {navigate('/'); return;}
    },[])
    
    const userId=user?.result?._id;
    const [m,setM]=useState(1);
    const [allWs,setWs]=useState([]);
    const [currentWsId, setCurrentWsId] = useState(null);
    const [currentCardId, setCurrentCardId] = useState(null);
    const[showLoader,setShowLoader]=useState(false);
    const activateWithKeyboard = (event, action) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        action();
      }
    };

    const getList=async()=>{
        setShowLoader(true);
        try {
          const list=await getData(userId);
          setWs(list.data);
        } catch (error) {
          toast.error(error?.response?.data?.message || 'Could not load folders');
        } finally {
          setShowLoader(false);
        }
    }
    useEffect(()=>{
        getList();
    },[])
    
    const deleteWs=async(wsId)=>{
        toast((t) => (
            <div>
              <p style={{marginBottom:'1vh'}}>Are you sure you want to delete this folder?</p>
              <button style={{borderRadius:'50%',padding:'1vh', border: 'none', marginLeft:'1vh',background:'#5a9a4a',color:'white'}} 
                      onClick={() => {toast.dismiss(t.id);return;}}>
                No
              </button>
              <button style={{borderRadius:'50%',padding:'1vh', border: 'none', marginLeft:'1vh',background:'#5a9a4a',color:'white'}} 
                      onClick={async() => {
                        try {
                          await deleteWorkspace(userId,wsId);
                          toast.success('Deleted Folder');
                          await getList();
                        } catch (error) {
                          toast.error(error?.response?.data?.message || 'Could not delete folder');
                        } finally {
                          toast.dismiss(t.id);
                        }
                      }}>
                Yes
              </button>
            </div>
          ),{
            position:'top-center',
            duration:Infinity
          });
    }
    const editWsname = (wsId) => {
        setCurrentWsId(wsId);
        setM(3);
        setOpenModal({ state: true });
        //getList();
      };

    const addCard = (wsId) => {
        setCurrentWsId(wsId);
        setM(2);
        setOpenModal({ state: true });
    };

    const editCardName = (wsId, cardId) => {
        setCurrentWsId(wsId);
        setCurrentCardId(cardId);
        setM(4);
        setOpenModal({ state: true });
    };

    const deleteCard = async (wsId, cardId) => {
        toast((t) => (
            <div>
              <p style={{marginBottom:'1vh'}}>Are you sure you want to delete this Workspace?</p>
              <button style={{borderRadius:'50%',padding:'1vh', border: 'none', marginLeft:'1vh',background:'#5a9a4a',color:'white'}} 
                      onClick={() => {toast.dismiss(t.id);return;}}>
                No
              </button>
              <button style={{borderRadius:'50%',padding:'1vh', border: 'none', marginLeft:'1vh',background:'#5a9a4a',color:'white'}} 
                      onClick={async() => {
                        try {
                          await deleteCardFromWorkspace(userId, wsId, cardId);
                          toast.success('Deleted Workspace');
                          await getList();
                        } catch (error) {
                          toast.error(error?.response?.data?.message || 'Could not delete file');
                        } finally {
                          toast.dismiss(t.id);
                        }
                      }}>
                Yes
              </button>
            </div>
          ),{
            position:'top-center',
            duration:Infinity
          });
    };
  return (
    <><Navbar/>
    <div className="home">
        <div className="header">
                <h3 className="heading">
                    My <span> Folders</span>
                </h3>
                <div className="add-button" role="button" tabIndex={0} aria-label="Create new folder"
                  onKeyDown={(event) => activateWithKeyboard(event, () => {setM(1); setOpenModal({ state: true});})}
                    onClick={() => {setM(1); setOpenModal({ state: true})}}
                > <span>+</span> New Folder</div>        
        </div>
        {showLoader ? <div className='fullpage-loader'>
            <div className='loader'></div>
        </div>:
        (allWs.length==0?<><h2 style={{color:'white'}}>No existing folders.Try creating one.</h2></>:
            allWs.map((ele)=>(
                <div className='folder-card' key={ele._id}>
                    <div className="f-header">
                        <h3 className="f-heading">
                            <FcOpenedFolder/>{ele.title}
                        </h3>
                        <div className="folder-icons">
                            <IoTrashOutline role="button" tabIndex={0} aria-label={`Delete folder ${ele.title}`} title="Delete folder" onClick={()=>deleteWs(ele._id)} onKeyDown={(event) => activateWithKeyboard(event, () => deleteWs(ele._id))}/>
                            <BiEditAlt role="button" tabIndex={0} aria-label={`Rename folder ${ele.title}`} title="Rename folder" onClick={() => editWsname(ele._id)} onKeyDown={(event) => activateWithKeyboard(event, () => editWsname(ele._id))}/>
                            <div className="f-add-button" role="button" tabIndex={0} aria-label={`Create file in ${ele.title}`}
                              onKeyDown={(event) => activateWithKeyboard(event, () => addCard(ele._id))}
                                onClick={() => addCard(ele._id)}
                            ><span>+</span> New File </div>
                        </div>
                    </div>
                    <div className="ws-cards" >
                    { ele.cards.map((card)=>(                       
                            <div className="card" key={card._id}>
                                <div className="card-container" onClick={()=>navigate(`/playground/${ele._id}/${card._id}`)}>
                                    <img className="logo" src={logo} alt="Logo" />
                                    <div className="card-content">
                                        <p>{card.title}</p>
                                        <p>{card.language}</p>
                                    </div>
                                </div>
                                <div className="folder-icons">
                                    <IoTrashOutline role="button" tabIndex={0} aria-label={`Delete file ${card.title}`} title="Delete file" onClick={() => deleteCard(ele._id, card._id)} onKeyDown={(event) => activateWithKeyboard(event, () => deleteCard(ele._id, card._id))}/>
                                    <BiEditAlt role="button" tabIndex={0} aria-label={`Rename file ${card.title}`} title="Rename file" onClick={() => editCardName(ele._id, card._id)} onKeyDown={(event) => activateWithKeyboard(event, () => editCardName(ele._id, card._id))}/>
                                </div>
                            </div>     
                    ))} 
                    </div>             
                </div>
            )))
        }     
        {openModal.state && (
            //this is used to pass props from children to parent to update parent component upon updation caused by child component
                <Modal
                  openModal={m}
                  setOpenModal={setOpenModal}
                  wsId={currentWsId}
                  cardId={currentCardId}
                  getLists={getList}
                />
              )}     
    </div>   
    </>                     
  )
}

export default Home