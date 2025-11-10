import axios from 'axios';
const API= axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://codecanvas-api.onrender.com/', // Your backend server URL
});

API.interceptors.request.use((req)=>{
  if(localStorage.getItem('profile')){
      JSON.parse(localStorage.getItem('profile'))
      req.headers.authorization=`Bearer ${JSON.parse(localStorage.getItem('profile')).token}`
  }
  return req;
})

export const signIn=(formData)=>API.post('/user/signin',formData);
export const signUp=(formData)=>API.post('/user/signup',formData);

export const getData=(id)=>API.get(`/user/${id}/workspaces`);
export const addData=(id,newWs)=>API.post(`/user/${id}/workspaces`,newWs);
export const deleteWorkspace = (userId, wsId) => API.delete(`/user/${userId}/workspaces/${wsId}`);
export const updateWorkspaceName = (userId, wsId, newName) => API.patch(`/user/${userId}/workspaces/${wsId}`, { title: newName });
export const addCardToWorkspace = (userId, wsId, newCard) => API.patch(`/user/${userId}/workspaces/${wsId}/addCard`, newCard);
export const updateCardName = (userId, wsId, cardId, newTitle) => API.patch(`/user/${userId}/workspaces/${wsId}/cards/${cardId}/name`, { newTitle });
export const deleteCardFromWorkspace = (userId, wsId, cardId) => API.delete(`/user/${userId}/workspaces/${wsId}/cards/${cardId}`);
export const updateCardCode = (userId, wsId, cardId, newCode) => API.patch(`/user/${userId}/workspaces/${wsId}/cards/${cardId}/code`, { newCode });
export const getCardDetails=(userId, wsId, cardId)=>API.get(`/user/${userId}/workspaces/${wsId}/cards/${cardId}/card`);


export const createRoom = () => API.post('/createRoom');

export default API;
